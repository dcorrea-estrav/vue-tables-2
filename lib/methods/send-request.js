module.exports = function (data) {

    if (typeof this.opts.requestFunction === 'function') {
        return this.opts.requestFunction.call(this, data);
    }

    if (typeof axios !== 'undefined') {
        if (this.cancelToken) { // cancel prev request
            this.cancelToken.cancel();
        }

        this.cancelToken = axios.CancelToken.source()

        return axios.get(this.url, {
            params: data,
            cancelToken: this.cancelToken.token
        }).catch(function (e) {
            this.cancelToken = null
            this.dispatch('error', e);
            this.loadingError = true
        }.bind(this));
    }

    if (typeof this.$http !== 'undefined')
        return this.$http.get(this.url, {params: data}).then(function (data) {
            return data.json();
        }.bind(this), function (e) {
            this.dispatch('error', e);
            this.loadingError = true
        }.bind(this));

    if (typeof $ != 'undefined')
        return $.getJSON(this.url, data).fail(function (e) {
            this.dispatch('error', e);
            this.loadingError = true
        }.bind(this));

    throw "vue-tables: No supported ajax library was found. (jQuery, axios or vue-resource). To use a different library you can write your own request function (see the `requestFunction` option)";
}
