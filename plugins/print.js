import Vue from 'vue'
import QRCode from 'qrcode'
const Print = function(dom, options) {
	if (!(this instanceof Print)) {
		return new Print(dom, options)
	}

	this.options = this.extend(
		{
			noPrint: '.no-print',
		},
		options
	)

	if (typeof dom === 'string') {
		this.dom = document.querySelector(dom)
	} else {
		this.dom = dom
	}

	this.init()
}

Print.prototype = {
	init: function() {
		var content = this.getStyle() + this.getHtml()
		this.writeIframe(content)
	},
	extend: function(obj, obj2) {
		for (var k in obj2) {
			obj[k] = obj2[k]
		}
		return obj
	},

	getStyle: function() {
		var str =
			'<style type="text/css">*{margin:0;padding:0;} #printForm,#packPrintForm,#bagPrintForm,#materialPrintForm{padding:15px 20px 0 0;font-size:12px;font-weight:300;} p{line-height:20px;} table{font-size:12px;font-weight:300;border-collapse:collapse; border:1px solid #777;} td{text-align:center;border-collapse:collapse; border: 1px solid #777;padding:5px;}</style>'
		// var styles = document.querySelectorAll('style');
		// for (var i = 0; i < styles.length; i++) {
		//     str += styles[i].outerHTML;
		// }
		// str += '<style>' + (this.options.noPrint ? this.options.noPrint : '.no-print') + '{display:none;}</style>';
		return str
	},

	getHtml: function() {
		var inputs = document.querySelectorAll('input')
		var textareas = document.querySelectorAll('textarea')
		var selects = document.querySelectorAll('select')
		var QRCode = document.querySelector('#QRCode')
		var qrcode = document.querySelector('#qrcode')
		var printTitle = document.querySelector('.printTitle')
		var tabtitle = document.querySelector('.tabtitle')
		// console.log('canvas', canvas)

		for (var k in inputs) {
			if (inputs[k].type === 'checkbox' || inputs[k].type === 'radio') {
				if (inputs[k].checked === true) {
					inputs[k].setAttribute('checked', 'checked')
				} else {
					inputs[k].removeAttribute('checked')
				}
			} else if (inputs[k].type === 'text') {
				inputs[k].setAttribute('value', inputs[k].value)
			}
		}

		for (var k2 in textareas) {
			if (textareas[k2].type === 'textarea') {
				textareas[k2].innerHTML = textareas[k2].value
			}
		}

		for (var k3 in selects) {
			if (selects[k3].type === 'select-one') {
				var child = selects[k3].children
				for (var i in child) {
					if (child[i].tagName === 'OPTION') {
						if (child[i].selected === true) {
							child[i].setAttribute('selected', 'selected')
						} else {
							child[i].removeAttribute('selected')
						}
					}
				}
			}
		}

		if (QRCode) {
			var image = new Image()
			image.src = QRCode.toDataURL('image/png')
			console.log('image', image)
			qrcode.innerHTML = ''
			qrcode.appendChild(image)
			qrcode.style.float = 'right'
			printTitle.style.position = 'absolute'
			printTitle.style.left = '50%'
			printTitle.style.top = '50%'
			printTitle.style.transform = 'translate(-50%, -50%)'
			tabtitle.style.position = 'relative'
		}
		// console.log('this.dom.outerHTML', this.dom.outerHTML)
		return this.dom.outerHTML
	},

	writeIframe: function(content) {
		var w
		var doc
		var iframe = document.createElement('iframe')
		var f = document.body.appendChild(iframe)
		iframe.id = 'myIframe'
		iframe.style = 'position:absolute;width:0;height:0;top:-10px;left:-10px;'

		w = f.contentWindow || f.contentDocument
		doc = f.contentDocument || f.contentWindow.document
		doc.open()
		doc.write(content)
		doc.close()
		this.toPrint(w)

		setTimeout(function() {
			document.body.removeChild(iframe)
		}, 100)
	},

	toPrint: function(frameWindow) {
		try {
			setTimeout(function() {
				frameWindow.focus()
				try {
					if (!frameWindow.document.execCommand('print', false, null)) {
						frameWindow.print()
					}
				} catch (e) {
					frameWindow.print()
				}
				frameWindow.close()
			}, 10)
		} catch (err) {
			console.log('err', err)
		}
	},
}

Vue.prototype.$print = Print

const list = {
	Print,
}

export default list
