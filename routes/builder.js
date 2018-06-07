module.exports = function build(data) {
    var info = {
        person: {
            name: {
                first: data.nameFirst.toLowerCase(),
                last: data.nameLast.toLowerCase()
            },
            parent: {
                first: data.parentFirst.toLowerCase(),
                last: data.parentLast.toLowerCase()
            },
            email: data.email,
            paid: false,
            session: data.session,
            regTime: new Date()
        }
    }

    return info;
}