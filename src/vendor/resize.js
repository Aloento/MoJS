/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Main {
  constructor(o={}){
    this.o = o;
    if (window.isAnyResizeEventInited) { return; }
    this.vars();
    this.redefineProto();
  }

  vars() {
    window.isAnyResizeEventInited = true;
    this.allowedProtos = [
      HTMLDivElement,
      HTMLFormElement,
      HTMLLinkElement,
      HTMLBodyElement,
      HTMLParagraphElement,
      HTMLFieldSetElement,
      HTMLLegendElement,
      HTMLLabelElement,
      HTMLButtonElement,
      HTMLUListElement,
      HTMLOListElement,
      HTMLLIElement,
      HTMLHeadingElement,
      HTMLQuoteElement,
      HTMLPreElement,
      HTMLBRElement,
      HTMLFontElement,
      HTMLHRElement,
      HTMLModElement,
      HTMLParamElement,
      HTMLMapElement,
      HTMLTableElement,
      HTMLTableCaptionElement,
      HTMLImageElement,
      HTMLTableCellElement,
      HTMLSelectElement,
      HTMLInputElement,
      HTMLTextAreaElement,
      HTMLAnchorElement,
      HTMLObjectElement,
      HTMLTableColElement,
      HTMLTableSectionElement,
      HTMLTableRowElement
    ];
    return this.timerElements = {
      img:        1,
      textarea:   1,
      input:      1,
      embed:      1,
      object:     1,
      svg:        1,
      canvas:     1,
      tr:         1,
      tbody:      1,
      thead:      1,
      tfoot:      1,
      a:          1,
      select:     1,
      option:     1,
      optgroup:   1,
      dl:         1,
      dt:         1,
      br:         1,
      basefont:   1,
      font:       1,
      col:        1,
      iframe:     1
    };
  }

  redefineProto() {
    let t;
    const it = this;
    return t = (() => {
      const result = [];
      for (let i = 0; i < this.allowedProtos.length; i++) {
        const proto = this.allowedProtos[i];
        if ((proto.prototype == null)) { continue; }
        result.push((function(proto){
          const listener = proto.prototype.addEventListener || proto.prototype.attachEvent;
          (function(listener){
            const wrappedListener = function() {
              if ((this !== window) || (this !== document)) {
                const option = (arguments[0] === 'onresize') && !this.isAnyResizeEventInited;
                option && it.handleResize({
                  args:arguments,
                  that:this
                });
              }
              return listener.apply(this,arguments);
            };
            if (proto.prototype.addEventListener) {
              return proto.prototype.addEventListener = wrappedListener;
            } else if (proto.prototype.attachEvent) {
              return proto.prototype.attachEvent = wrappedListener;
            }
          })(listener);

          const remover = proto.prototype.removeEventListener || proto.prototype.detachEvent;
          return (function(remover){
            const wrappedRemover = function() {
              this.isAnyResizeEventInited = false;
              this.iframe && this.removeChild(this.iframe);
              return remover.apply(this,arguments);
            };
            if (proto.prototype.removeEventListener) {
              return proto.prototype.removeEventListener = wrappedRemover;
            } else if (proto.prototype.detachEvent) {
              return proto.prototype.detachEvent = wrappedListener;
            }
          })(remover);
        })(proto));
      }
      return result;
    })();
  }

  handleResize(args){
    const el = args.that;
    if (!this.timerElements[el.tagName.toLowerCase()]) {
      const iframe = document.createElement('iframe');
      el.appendChild(iframe);
      iframe.style.width      = '100%';
      iframe.style.height     = '100%';
      iframe.style.position   = 'absolute';
      iframe.style.zIndex     = -999;
      iframe.style.opacity    = 0;
      iframe.style.top        = 0;
      iframe.style.left       = 0;

      const computedStyle = window.getComputedStyle ?
        getComputedStyle(el)
      : el.currentStyle;

      const isNoPos = el.style.position === '';
      const isStatic = (computedStyle.position === 'static') && isNoPos;
      const isEmpty  = (computedStyle.position === '') && (el.style.position === '');
      if (isStatic || isEmpty) {
        el.style.position = 'relative';
      }
      if (iframe.contentWindow != null) {
        iframe.contentWindow.onresize = e=> this.dispatchEvent(el);
      }
      el.iframe = iframe;
    } else { this.initTimer(el); }
    return el.isAnyResizeEventInited = true;
  }

  initTimer(el){
    let width   = 0;
    let height  = 0;
    return this.interval = setInterval(() => {
      const newWidth  = el.offsetWidth;
      const newHeight = el.offsetHeight;
      if ((newWidth !== width) || (newHeight !== height)) {
        this.dispatchEvent(el);
        width  = newWidth;
        return height = newHeight;
      }
    }
    , this.o.interval || 62.5);
  }

  dispatchEvent(el){
    let e;
    if (document.createEvent) {
      e = document.createEvent('HTMLEvents');
      e.initEvent('onresize', false, false);
      return el.dispatchEvent(e);
    } else if (document.createEventObject) {
      e = document.createEventObject();
      return el.fireEvent('onresize', e);
    } else { return false; }
  }

  destroy() {
    clearInterval(this.interval);
    this.interval = null;
    window.isAnyResizeEventInited = false;

    const it = this;
    return (() => {
      const result = [];
      for (let i = 0; i < this.allowedProtos.length; i++) {
        const proto = this.allowedProtos[i];
        if ((proto.prototype == null)) { continue; }
        result.push((function(proto){
          const listener = proto.prototype.addEventListener || proto.prototype.attachEvent;
          if (proto.prototype.addEventListener) {
            proto.prototype.addEventListener = Element.prototype.addEventListener;
          } else if (proto.prototype.attachEvent) {
            proto.prototype.attachEvent = Element.prototype.attachEvent;
          }

          if (proto.prototype.removeEventListener) {
            return proto.prototype.removeEventListener = Element.prototype.removeEventListener;
          } else if (proto.prototype.detachEvent) {
            return proto.prototype.detachEvent = Element.prototype.detachEvent;
          }
        })(proto));
      }
      return result;
    })();
  }
}

if ((typeof define === "function") && define.amd) {
  return define("any-resize-event", [], () => new Main);
} else if ((typeof module === "object") && (typeof module.exports === "object")) {
  return module.exports = new Main;
} else {
  if (typeof window !== 'undefined' && window !== null) {
    window.AnyResizeEvent = Main;
  }
  return (typeof window !== 'undefined' && window !== null ? window.anyResizeEvent = new Main : undefined);
}
