export default {
    install(Vue) {

        /**
         * 判断字符串是否可用
         * @param str
         * @returns {boolean}
         */
        Vue.prototype.strError = function (str) {
            if (str == null) {
                return true;
            }
            if (str == '') {
                return true;
            }
            if (str == undefined) {
                return true;
            }
            if (str.toString().replace(/\s+/g, '').length == 0) {
                return true;
            }
            return false;
        };

        /**
         * 显示正在加载
         * @param str
         * @returns {boolean}
         */
        Vue.prototype.showLoading = function (str) {
            this.$Message.destroy()
            const msg = this.$Message.loading({
                content: str,
                duration: 5000
            });
        };
        /**
         * 显示加载完成
         * @param str
         * @returns {boolean}
         */
        Vue.prototype.showLoadDone = function (str) {
            this.$Message.destroy()
            this.$Message.success(str);
        };
        /**
         * 显示加载失败
         * @param str
         * @returns {boolean}
         */
        Vue.prototype.showLoadFailed = function (str) {
            this.$Message.destroy()
            this.$Message.error(str);
        };


    }
}
