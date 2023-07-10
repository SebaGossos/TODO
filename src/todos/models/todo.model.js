import {v4 as uuidv4} from 'uuid'

export class Todo {

    /**
     * 
     * @param {String} description 
     */
    constructor(description) {

        if (!description) throw new Error('Falta asignarle una description como parametro')
        
        this.id = uuidv4()
        this.description = description
        this.done = false
        this.createdAt = new Date()

    }
}