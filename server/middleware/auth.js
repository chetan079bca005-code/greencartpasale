import jwt from 'jsonwebtoken';

export const isSeller = async (req, res, next) => {
    try {
        // Check for token in cookies
        const token = req.cookies.sellerToken;
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Not authorized, no token' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (!decoded.isSeller) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Not authorized as seller' 
                });
            }

            req.seller = decoded;
            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
}; 