class treeLoader {
  constructor(props) {
    const {
      treeData,
      treeProps,
      treeLoaderFn, //加载树结点的fn
      treeMultiLoaderFn, //批量加载树结点的fn
      checkHasChildFn, //判断是否有children【是否是叶子节点】
      loaderSuccessCallback,//全部加载完的回调
      loaderFailCallback,//加载失败的回调【暂无用】
    } = props;
    this.options = {
      maxMultiCount: 20,
      treeData,
      treeProps,
      treeLoaderFn,
      treeMultiLoaderFn, //批量加载树结点的fn
      checkHasChildFn,
      loaderSuccessCallback,
      loaderFailCallback,
    };
    this.initDep();
    this.running = [];
    //treeId : parentTreeId
    this.treeDataMap = {};
  }

  initDep() {
    Object.defineProperty(this.options, 'tip', {
      get() {
        return this.__tip;
      },
      set(val) {
        if (val) {
          this.loaderSuccessCallback(this.treeData);
        }

        this.__tip = val;
      }
    })

    this.options.tip = false;

    let self = this;

    this.toLoaderData = new Proxy([], {
      set(target, key, value, receiver) {
        if (key === 'length') {
          if (value > 0) {
            setTimeout(()=>{
              self._loadMulti();
            }, 100);
          }
        }
        return Reflect.set(target, key, value, receiver);
      },
      deleteProperty(target, key) {
        return Reflect.deleteProperty(target, key);
      }
    })
  }

  run() {
    this.load(this.options.treeData);
  }

  load(data) {
    if (data.__all) {
      return true;
    }
    data.__all = true;
    data.isClick = true;
    //console.log('--treeLoader--', data[this.options.treeProps.id]);

    this.running.push(1);
    this.options.treeLoaderFn(data).then(()=>{
      this.searchGrandChild(data);
    }).finally(()=>{
      this.running.pop();
      (this.running.length === 0) && (this.options.tip = true);
    })
  }

  findParentTreeIdLinkFromTreeData(treeId) {
    let parentId = this.treeDataMap[treeId];
    let arr = [parentId];
    if (this.treeDataMap[parentId]) {
      arr = arr.concat(this.findParentTreeIdLinkFromTreeData(parentId));
    }

    return arr;
  }

  findLeafFromTreeData(treeId) {
    let treeParentLinks = this.findParentTreeIdLinkFromTreeData(treeId);
    let treeParentLinksLength = treeParentLinks.length;

    const getParent = (GrandParent, index) => {
      let parent = GrandParent[this.options.treeProps.children].filter((item)=>item[this.options.treeProps.id] == treeParentLinks[index])[0];
      index--;
      if (index > -1) {
        parent = getParent(parent, index);
      }

      return parent;
    }
    let parent = null;
    if (this.options.treeData[this.options.treeProps.id] != treeParentLinks[treeParentLinksLength-1]) {
      console.error('treeLoader-findLeafFromTreeData treeParent Not Found')
      return {};
    }
    if (treeParentLinksLength === 1) {
      parent = this.options.treeData;
    }else {
      parent = getParent(this.options.treeData, treeParentLinksLength-2);
    }

    return parent[this.options.treeProps.children].filter((item)=>item[this.options.treeProps.id] == treeId)[0];
  }

  searchGrandChild(data) {
    data[this.options.treeProps.children] = data[this.options.treeProps.children] ?? [];
    data[this.options.treeProps.children].map((child) => {
      if (this.options.checkHasChildFn(child)) {
        this.treeDataMap[child[this.options.treeProps.id]] = data[this.options.treeProps.id];
        this.toLoaderData.push(child[this.options.treeProps.id]);
        // this.load(child);太多节点会导致请求过多
      }
    })
  }

  _loadMulti() {
    //超过最大值，就先截取最大值
    let length = this.toLoaderData.length >= this.options.maxMultiCount ? this.options.maxMultiCount : this.toLoaderData.length;
    if (length == 1 && this.options.treeMultiLoaderFn) {
      let qId = this.toLoaderData.splice(0, 1)[0];
      this.load(this.findLeafFromTreeData(qId));
    }else {
      this.loadMulti(this.toLoaderData.splice(0, length));
    }
  }

  loadMulti(ids) {
    let datas = [];
    ids.forEach((id)=>{
      let data = this.findLeafFromTreeData(id);
      data.__all = true;
      data.isClick = true;
      datas.push(data);
      this.running.push(1);
    })
    this.options.treeMultiLoaderFn(datas, this).then((resDatas)=>{
      resDatas.forEach((data)=>{
        let _data = this.findLeafFromTreeData(data[this.options.treeProps.id]);
        //console.log(111, _data.treeId, this.findParentTreeIdLinkFromTreeData(data[this.options.treeProps.id]), data.label,data.children[0].label);
        _data.children = data.children;

        this.running.pop();
        this.searchGrandChild(_data);
      })

    }).finally(()=>{
      (this.running.length === 0) && (this.options.tip = true);
    })
  }
}

export default treeLoader;
