module.exports = function build(data) {
    var name = data.name.toLowerCase();
    var info = {
        person: {
            name: name,
            parent: data.parent,
            email: data.email,
            paid: false,
            regTime: new Date()
        }
    }

    return info;
}