export function debug(event, data) {

    if (this.state.debug) {
        console.log(event, data);
    }

}