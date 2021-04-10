interface Config {
    cookie: string | undefined;
    "x-csrf-token": string | undefined
}

const session: Config = {
    "cookie": undefined,
    "x-csrf-token": undefined,
};
export default session;


