class List {
    constructor (list, key, route) {
        /** @private */
        this.list = list;
        this.key = key;
        this.route = route;
        this.response;
    }
    setResponse(code, message, content) {
        return this.response = { code: code, message: message, content: content??"" }
    }
    createError(message, code) {
        const err = new Error(message)
        err.code = code;
        throw err;
    }
    isVoid(list) {
        if (!list) this.createError("La lista no contiene ningún elemento", 204);
    }
    isParam(param) {
        if (!param) this.createError(`No se coloco el parametro ${param}`, 428);
    }
    isValidPosition(position, min, max) {
            // valida si position es menor que min o mayor que max, sino, no hace nada
            // validate if position is minor than min or upper than max, else, doesn't anything
            if (position < min) this.createError("Posición demasiado baja", 416)
            if (position > max) this.createError("Posición demasiado alta", 416)
    }
    create(newObj) {
        this.isParam(newObj)
        this.list.push(this.key, newObj, this.route)
        const list = this.read().content;
        this.setResponse(201, "Elemento creado", list)
        return this.response;
    }
    read() {
        const list = this.list.get(this.key, this.route??"")
        this.isVoid()
        this.setResponse(200, "Lista obtenida", list)
        return this.response
    }
    update(pos, newObj) {
        const old = this.read().content;
        this.isVoid(old)
        this.isParam(pos)
        this.isParam(newObj)
        this.isValidPosition(pos, 0, this.read().content.length-1)
        old[pos] = newObj
        const actual = this.list.get(this.key);
        this.list.update(this.key, actual)
        this.setResponse(200, "Elemento de lista actualizado")
    }
    delete(pos, Obj) {
        const old = this.read().content;
        this.isVoid(actual)
        this.isParam(pos)
        this.isParam(newObj)
        this.isValidPosition(pos, 0, this.read().content.length-1)
        const list = this.list.remove(this.key, old[pos], this.route)
    }
}