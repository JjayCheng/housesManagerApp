const friendlyDate = timestamp => {
	var formats = {
		'year': '%n%年前',
		'month': '%n%月前',
		'day': '%n%天前',
		'hour': '%n%小时前',
		'minute': '%n%分钟前',
		'second': '%n%秒前',
	};
	var now = Date.now();
	var seconds = Math.floor((now - timestamp) / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	var months = Math.floor(days / 30);
	var years = Math.floor(months / 12);

	var diffType = '';
	var diffValue = 0;
	if (years > 0) {
		diffType = 'year';
		diffValue = years;
	} else {
		if (months > 0) {
			diffType = 'month';
			diffValue = months;
		} else {
			if (days > 0) {
				diffType = 'day';
				diffValue = days;
			} else {
				if (hours > 0) {
					diffType = 'hour';
					diffValue = hours;
				} else {
					if (minutes > 0) {
						diffType = 'minute';
						diffValue = minutes;
					} else {
						diffType = 'second';
						diffValue = seconds === 0 ? (seconds = 1) : seconds;
					}
				}
			}
		}
	}
	return formats[diffType].replace('%n%', diffValue);
}
const friendlyContent = content => {
	var str = content;
	const regMap = filterMaps.contentFilterMap;
	regMap.forEach(reg => {
		str = str.replace(reg, '');
	});
	return str
}
const defaultBack = () => {
	window.history.back();
}
const getStorageSync = (key) => {
	var val = window.localStorage[key];
	(val === undefined ) && (val = window.localStorage[key] = []);
	return JSON.parse(val);
}
const setStorageSync = (key, val) => {
	window.localStorage[key] = JSON.stringify(val);
}
const longPress = (dom, cb) => {
	var timeout = undefined;
	dom.ontouchstart = function() {
		timeout = setTimeout(() => {
			cb && cb();
		}, 800);
	}
	dom.ontouchmove = function() {
		clearTimeout(timeout);
	}
	dom.ontouchend = function() {
		clearTimeout(timeout);
	}
}
const deleteKeepAliveCache　= (vm) => {
	if (vm.$vnode.parent && vm.$vnode.parent.componentInstance && vm.$vnode.parent.componentInstance.cache) {
		if (vm.$vnode.componentOptions) {
			var key = vm.$vnode.key == null
				? vm.$vnode.componentOptions.Ctor.cid + (vm.$vnode.componentOptions.tag ? `::${vm.$vnode.componentOptions.tag}` : '')
				: vm.$vnode.key;
			var cache = vm.$vnode.parent.componentInstance.cache;
			var keys  = vm.$vnode.parent.componentInstance.keys;
			if (cache[key]) {
				if (keys.length) {
					var index = keys.indexOf(key);
					if (index > -1) {
						keys.splice(index, 1);
					}
				}
				delete cache[key];
			}
		}
	}
	vm.$destroy();
}

export default {
	friendlyDate,
	friendlyContent,
	defaultBack,
	getStorageSync,
	setStorageSync,
	longPress,
	deleteKeepAliveCache
}