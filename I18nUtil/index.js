function _objCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function _isObject(obj) {
  return typeof obj == "object" && obj;
}
class I18nUtil {
  // 目标json
  jsonnnn = {};
  // 映射
  manifest = [];
  // 转换结果
  arrayyyy = [];

  constructor() {}
  create(json) {
    this.jsonnnn = json;
    this._formatJsonToArr(json);
  }
  _$set(obj, keys, value) {
    let keysArr = keys.split(".");
    if (keysArr.length === 1) {
      obj[keysArr[0]] = value;
    } else {
     const str = keys.split('.').map(text=>`['${text}']`).join('')
      eval(`obj${str}=value`);
    }
  }
  //判断是否为object
  _formatJsonToArr(json) {
    const countRef = { value: 0 };
    this._forEachArr(json, countRef);
  }
  // 最好做成一个promise
  _forEachArr(json, countRef, parentKey = "") {
    for (let k of Object.keys(json)) {
      if (typeof json[k] === "string") {
        this.arrayyyy[countRef.value] = json[k];
        this.manifest[countRef.value] = parentKey ? `${parentKey}.${k}` : k;
        countRef.value++;
      } else if (_isObject(json[k])) {
        this._forEachArr(
          json[k],
          countRef,
          parentKey ? `${parentKey}.${k}` : k
        );
      } else {
        console.error("unknow type");
      }
    }
  }

  // 参数：用户翻译完的文本，带回车
  rebuildByNewTemp(translateResult) {
    const translateResultArr = translateResult.split("\n");
    const result = _objCopy(this.jsonnnn);
    for (let i = 0; i < this.manifest.length; i++) {
      this._$set(result, this.manifest[i], translateResultArr[i]);
    }
    console.log(result);
    return result;
  }
  // TODO :camel
  getarrayyyy() {
    return this.arrayyyy;
  }
}

const i18nUtil = new I18nUtil();
const $result = document.getElementById("result");
const $tip = document.getElementById("tip");

document.getElementById("generate-btn").onclick = () => {
  i18nUtil.create(JSON.parse(document.getElementById("old-json").value));
  const val = i18nUtil.getarrayyyy();
  let result = "";
  for (let text of val) {
    result += `<div>${text}</div>`;
  }
  $result.innerHTML = result;
  $tip.innerText='将下边生成的文本赋值粘贴到excel，excel拿给产品翻译后粘贴至右侧（顺序不可改变）'
};
document.getElementById("rebuild-btn").onclick = () => {
  const newJsonVal = document.getElementById("new-json").value;
  const result = i18nUtil.rebuildByNewTemp(newJsonVal);
  $result.innerHTML = JSON.stringify(result);
  $tip.innerText='搞定了老铁！'
};
