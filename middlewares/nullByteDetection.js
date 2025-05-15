export const nullByteCheck = (req, res, next) => {
    try {
        console.log("Null byte check middleware triggered");
        // Function to recursively check for null bytes in objects
        const checkForNullBytes = (data) => {
            if (typeof data === 'string') {
                if (data.includes('\0') || data.includes('%00')) {
                    throw new Error('Null byte detected in input');
                }
            } else if (Array.isArray(data)) {
                data.forEach((item) => {
                    console.log('item', item);
                    checkForNullBytes(item)
                });
            } else if (typeof data === 'object' && data !== null) {
                for (const value of Object.values(data)) {
                    checkForNullBytes(value);
                }
            }
        };

        // Check query parameters
        checkForNullBytes(req.query);

        // Check request body (if it exists)
        console.log('req.body', req.body);
        if (req.body) {
            checkForNullBytes(req.body);
        }

        // Check headers
        checkForNullBytes(req.headers);

        // Check URL parameters
        checkForNullBytes(req.params);

        next();
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};