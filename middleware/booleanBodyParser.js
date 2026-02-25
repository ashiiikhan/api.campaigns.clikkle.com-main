export default function (req, res, next) {
    Object.keys(req.query).forEach((key) => {
        if (key.charAt(0) === "_") {
            req.query[key.slice(1)] = !["0", "false", ""].includes(
                req.query[key]
            );
            delete req.query[key];
        }
    });

    next();
}
