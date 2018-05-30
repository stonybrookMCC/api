module.exports = function build (data) {
    console.log(data)
    var info = {
        name: data.name,
        parent: data.parent,
        email: data.email,
        paid: false,
        regTime: new Date()
    }

    return info;
}