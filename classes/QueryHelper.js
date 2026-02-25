class QueryHelper {
    constructor(Model, options) {
        this.Model = Model;
    }

    deleteDoc(filters) {
        return function (req, res, next) {
            try {
                const deleted = await Model.deleteOne(filters);
                res.json({
                    success: deleted.acknowledged && deleted.modifiedCount,
                    ...(deleted.modifiedCount ? { message: "Failed to delete" } : null),
                });
            } catch (err) {
                next(err);
            }
        };
    }
}
