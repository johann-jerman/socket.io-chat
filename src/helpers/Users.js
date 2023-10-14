export default class Users {
    constructor(){
        this.users = []
    }

    setUser(id, room, turn){
        let user = this.users.push(
            {id,room,turn}
        );
        return user;
    }
    getUser(id){
        return this.users.filter(user => user.id == id)[0] || false;
    }
    getUserList(){

    }
    removeUser(id){
        let user = this.getUser(id);
        if (user) {
            user.filter(user => user.id != id);
        }
        return user;
    }
} 