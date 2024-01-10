import bcrypt from 'bcrypt';

const users = [
    {
        name: 'Alejandro',
        email: 'alejobetancur2@gmail.com',
        active: 1,
        password: bcrypt.hashSync('123456', 10),
    }
];

export default users;