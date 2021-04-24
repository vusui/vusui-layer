export default class Util {
    // layer 类型String
    static typeString(index) {
        switch (index) {
            case 0:
                return 'alert';
                break;
            case 1:
                return 'page';
                break;
            case 2:
                return 'iframe';
                break;
            case 3:
                return 'loading';
                break;
            case 4:
                return 'tips';
                break;
            case 5:
                return 'msg';
                break;
            case 6:
                return 'notify';
                break;
            case 7:
                return 'drawer';
                break;
            case 8:
                return 'prompt';
                break;
            case 9:
                return 'photos';
                break;
            default:
                break;
        }
    }

    // layer 类型Number
    static typeNumber(value) {
        switch (value) {
            case 'alert':
                return 0;
                break;
            case 'page':
                return 1;
                break;
            case 'iframe':
                return 2;
                break;
            case 'loading':
                return 3;
                break;
            case 'tips':
                return 4;
                break;
            case 'msg':
                return 5;
                break;
            case 'notify':
                return 6;
                break;
            case 'drawer':
                return 7;
                break;
            case 'prompt':
                return 8;
                break;
            case 'photos':
                return 9;
                break;
            default:
                break;
        }
    }

    // layer class样式
    static layerClass(index) {
        switch (index) {
            case 0:
                return 'vus-layer-title';
                break;
            case 1:
                return 'vus-layer-button';
                break;
            case 2:
                return 'vus-layer-content-scroll';
                break;
            case 3:
                return 'vus-layer-content-iframe';
                break;
            case 4:
                return 'vus-layer-tips-arrow';
                break;
            case 5:
                return 'vus-layer-content-text';
                break;
            case 6:
                return 'vus-layer-content-input';
                break;
            case 7:
                return 'vus-layer-photos';
                break;
            default:
                break;
        }
    }

    // 获取dom元素
    static $(obj, index = 0, node = document) {
        if (typeof obj == 'string') {
            let nodes = node.querySelectorAll(obj);
            return (index == -1) ? nodes : nodes[index];
        }
        return obj;
    }

    /**
     * [assign 合并对象，返回一个新对象]
     * @return {[Obj]} [默认值和选项的合并值]
     */
    static assign(options, defaults) {
        for (let key in defaults) {
            if (options[key] == undefined) {
                options[key] = defaults[key];
            }
        }
        return options;
    }

    // 扩展对象
    static extend(to, froms) {
        for (let key in froms) {
            to[key] = froms[key];
        }
        return to;
    }

    /**
     * [each 遍历]
     * @param  {[type]}   obj [description]
     * @param  {Function} fn  [description]
     * @return {[type]}       [description]
     */
    static each(obj, fn) {
        let key, that = this;
        if (typeof fn !== 'function') return that;
        obj = obj || [];
        if (obj.constructor === Object) {
            for (key in obj) {
                if (fn.call(obj[key], key, obj[key])) break;
            }
        } else {
            for (key = 0; key < obj.length; key++) {
                if (fn.call(obj[key], key, obj[key])) break;
            }
        }
        return that;
    }

    /**
     * [addEvent addEventListener]
     * @param {[type]} element  [dom元素]
     * @param {[type]} event    [事件]
     * @param {[type]} handler  [回调]
     */
    static on = (function() {
        if (document.addEventListener) {
            return function(element, event, handler) {
                if (element && event && handler) {
                    element.addEventListener(event, handler, false);
                }
            };
        } else {
            return function(element, event, handler) {
                if (element && event && handler) {
                    element.attachEvent('on' + event, handler);
                }
            };
        }
    })()

    /* [removeEventListener] */
    static off = (function() {
        if (document.removeEventListener) {
            return function(element, event, handler) {
                if (element && event) {
                    element.removeEventListener(event, handler, false);
                }
            };
        } else {
            return function(element, event, handler) {
                if (element && event) {
                    element.detachEvent('on' + event, handler);
                }
            };
        }
    })()
    
    /**
     * Get the offset base on the document.
     * @param {Element} element - The target element.
     * @returns {Object} The offset data.
     */
    static getOffset(element) {
        let box = element.getBoundingClientRect();
        return {
            left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
            top: box.top + (window.pageYOffset - document.documentElement.clientTop)
        };
    }
    

    /**
     * [addClass 添加类]
     * @param {[type]} obj [dom元素]
     * @param {[type]} cls [类名]
     */
    static addClass(element, name) {
        let oldList = this.classList(element),
            newList = oldList + name;

        if (this.hasClass(oldList, name)) return;
        // Trim the opening space.
        element.className = newList.substring(1);
    }

    /**
     * [removeClass 移除类]
     * @param {[type]} element [dom元素]
     * @param {[type]} name [类名]
     */
    static removeClass(element, name) {
        let oldList = this.classList(element),
            newList;

        if (!this.hasClass(element, name)) return;
        // Replace the class name.
        newList = oldList.replace(' ' + name + ' ', ' ');
        // Trim the opening and closing spaces.
        element.className = newList.substring(1, newList.length - 1);
    }

    /**
     * [hasClass 判断类名是否存在]
     * @param  {[type]}  element [dom元素]
     * @param  {[type]}  name [类名]
     */
    static hasClass(element, name) {
        let list = typeof element == 'string' ? element : this.classList(element);
        return list.indexOf(' ' + name + ' ') >= 0;
    }

    /**
     * [toggleClass 删除（添加）一个类]
     * @param  {[type]} element [dom元素]
     * @param  {[type]} name [类名]
     */
    static toggleClass(element, name) {
        if (this.hasClass(element, name)) {
            this.removeClass(element, name);
        } else {
            this.addClass(element, name);
        }
    }

    // classList
    static classList(element) {
        return (' ' + (element && element.className || '') + ' ').replace(/\s+/gi, ' ');
    }

    /**
     * [getClass 获取类名]
     * @param  {[type]} element   [dom元素]
     * @param  {[type]} name [类名]
     * @return {[type]} 
     */
    static getClass(name, element = document, tag = '*') {
        //支持这个函数
        if (document.getElementsByClassName) {
            return element.getElementsByClassName(name);
        } else {
            //获取标签
            let tags = element.getElementsByTagName(tag),
                //用于返回类名为className的元素
                tagArr = [];
            this.each(tags, function(index) {
                if (tags[index].class == name) {
                    //保存满足条件的元素
                    tagArr[tagArr.length] = tags[index];
                }
            });
            return tagArr;
        }
    }

    /**
     * [css 设置样式,3个参数设置,2个参数获取]
     * @param  {[type]} element   [DOM]
     * @param  {[type]} prop   [样式属性]
     * @param  {[type]} value  [样式值]
     * @return {[type]} 
     */
    static css(element, prop, value) {
        if (value === undefined) {
            if (typeof(prop) == 'object') {
                for (let key in prop) {
                    element.style[key] = prop[key];
                }
                return element;
            } else {
                let style = getComputedStyle(element);
                return style[prop];
            }
        } else {
            element.style[prop] = value;
            return element;
        }
    }

    /**
     * [hide 隐藏元素]
     * @param (...args) {'1','2','3',...}
     */
    static hide(...args) {
        this.each(args, function(index) {
            args[index].style.display = 'none';
        });
    }

    /**
     * [show 显示元素]
     * @param (...args) {'1','2','3',...}
     */
    static show(...args) {
        this.each(args, function(index) {
            args[index].style.display = 'block';
        });
    }

    //获取节点的style属性值
    static getStyle(node, name) {
        var style = node.currentStyle ? node.currentStyle : window.getComputedStyle(node, null);
        return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
    }

    /**
     * [createDOM 创建DOM元素]
     * @param  {[type]} tag [标签名]
     * @param  {[type]} cls [类名]
     */
    static createDOM(tag, cls = null) {
        let elem = document.createElement(tag);
        if (cls) {
            this.addClass(elem, cls);
        }
        return elem;
    }

    /**
     * [find 找到指定子级元素]
     * @param  {[type]} obj [元素名,ID,类]
     * @param  {[type]} event [父级元素DOM]
     * @param  {[type]} index [-1=多个]
     */
    // 找到指定子级元素
    static find(obj, event, index = 0) {
        return this.$(obj, index, event);
    }

    // 判断是否数字添加单位px
    static addpx(value) {
        let unit = typeof value === 'number' && !isNaN(value);
        if (unit) {
            return `${parseFloat(value)}px`;
        } else {
            return value;
        }
    }

    /**
     * sleep 休眠功能
     * @param time 毫秒
     * @return
     */
    static sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time))
    }

    // 深度拷贝
    static deepClone(target) {
        let copyed_objs = []; //此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象 
        function _deepCopy(target) {
            if ((typeof target !== 'object') || !target) {
                return target;
            }
            for (let i = 0; i < copyed_objs.length; i++) {
                if (copyed_objs[i].target === target) {
                    return copyed_objs[i].copyTarget;
                }
            }
            let obj = {};
            if (Array.isArray(target)) {
                obj = []; //处理target是数组的情况 
            }
            copyed_objs.push({
                target: target,
                copyTarget: obj
            })
            Object.keys(target).forEach(key => {
                if (obj[key]) {
                    return;
                }
                obj[key] = _deepCopy(target[key]);
            });
            return obj;
        }
        return _deepCopy(target);
    }

    // 默认确定按钮操作
    static yes(event, options) {
        if (typeof(options.yes) == 'function') {
            options.yes(options.id, event);
        } else if (typeof(options['btn1']) == 'function') {
            options['btn1'](options.id, event);
        } else {
            options.vusui.close(options.id);
        }
    }

    // 默认取消按钮操作
    static cancel(event, options, index) {
        if (typeof(options['btn' + index]) == 'function') {
            options['btn' + index](options.id, event);
        } else {
            options.vusui.close(options.id);
        }
    }

    // 右上解关闭操作
    static close(options) {
        if (typeof(options.cancel) == 'function') {
            options.cancel(options.id, event);
            options.vusui.close(options.id);
        } else {
            options.vusui.close(options.id);
        }
    }

    // 关闭全部
    static closeAll(type = -1, options) {
        options.vusui.closeAll(type);
    }

    // 点击mask关闭弹窗
    static maskClose(event, options) {
        let mask = event.target.getAttribute('class');
        if (mask && (mask.indexOf('vus-layer-mask') > -1 || mask.indexOf('vus-layer-close') > -1)) {
            options.vusui.close(options.id);
        }
    }

    // 全屏状态滚动条设置 
    static rescollbar(id) {
        if (this.$('html').getAttribute('full-id') == id) {
            if (this.$('html').style.removeProperty) {
                this.$('html').style.removeProperty('overflow');
            } else {
                this.$('html').style.removeAttribute('overflow');
            }
            this.$('html').removeAttribute('full-id');
        }
    }

    // 判断是否是url地址
    static isHttp(url) {
        let regUrl = /^(http|https):\/\//;
        return regUrl.test(url)
    }

}
