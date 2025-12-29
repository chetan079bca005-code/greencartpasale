import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    try {
        const { sellerToken } = req.cookies;
        console.log('Auth check - Cookies:', req.cookies);

        if (!sellerToken) {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        console.log('Token decode:', tokenDecode);

        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next();
        } else {
            return res.json({ success: false, message: 'Not Authorized' });
        }
    } catch (error) {
        console.log('Auth error:', error.message);
        return res.json({ success: false, message: 'Not Authorized' });
    }
};

export default authSeller;