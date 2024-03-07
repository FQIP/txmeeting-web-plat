let priKey = 1;
function digui(arr) { // 递归树数据添加label(orgName, deptName, userName)
  let res = []
  arr.forEach(item => {
    priKey++;
    let userId = item.id 
    let basItem = {
      nodeType: item.nodeType,
      hasChildren: item.hasChildren,
      sffy: item?.sffy,
      userName: item.name,
    }
    if (item?.children?.length) {
      res.push({
        ...basItem,
        label: item?.orgName || item?.deptName || (item?.realName ? item.realName + '(' +item.userName + ')' : ''),
        children: digui(item.children),
        userId: userId,
        treeId: userId + '_' + priKey,
      })
    } else {
      res.push({
        ...basItem,
        label: item?.orgName || item?.deptName || (item?.realName ? item.realName + '(' +item.userName + ')' : ''),
        children: item.nodeType !== 'user' && item.hasChildren ? [{userId: undefined}] : [],
        userId: userId,
        treeId: userId + '_' + priKey,
        isClick: false,
      })
    }
  })
  return res
}

function findTreeDataByUserId(treeData, id) {
  let res = [];
  treeData.forEach((item)=>{
    if ( item.children?.length > 0) {
      res = res.concat(findTreeDataByUserId(item.children, id));
    }else if(item.id == id) {
      res.push(item);
    }
  })

  return res;
}

function filterTreeLeaf(tree, filterFn) {
  var res = [];
  tree.forEach((item) => {
    if (filterFn(item))  {
      let children = null;
      if (Array.isArray(item.children) && item.children.length > 0) {
        children = filterTreeLeaf(item.children, filterFn);
        children = children.length == 0 ? undefined : children;
      }
      res.push({...item, children: children})
    }
  })
  return res;
}

function flattenTreeLeaf(tree, treeId = "id", filterFn) {
  var res = [];
  tree.forEach((item) => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      res = res.concat(flattenTreeLeaf(item.children, treeId, filterFn));
    } else {
      (!filterFn || filterFn(item)) &&  res.push(item[treeId])
    }
  })
  return res;
}

function getIconByType(type) {
  let icon = ''
  switch (type) {
    case 'directory':icon = 'icon-dakaiwenjianjia';break;
    case 'zip': icon = 'icon-zip';break;
    case 'txt': icon = 'icon-txt1';break;
    case 'doc':
    case 'rtf':
    case 'docx':icon = 'icon-word';break;
    case 'mp3':
    case 'wav':icon = 'icon-yinpin';break;
    case 'mp4':
    case 'avi':icon = 'icon-shipin';break;
    case 'jpg':
    case 'png':
    case 'jpeg':icon = 'icon-jpgpngjpeg';break;
    case 'gif':icon = 'icon-gif';break;
    case 'xls':
    case 'xlsx':icon = 'icon-xls';break;
    case 'pdf':icon = 'icon-pdf';break;
    case 'ppt':
    case 'pptx':icon='icon-pptpptx';break;
    default: icon = 'icon-word';break;
  }
  return icon
}

export { digui, findTreeDataByUserId, flattenTreeLeaf, filterTreeLeaf, getIconByType }
