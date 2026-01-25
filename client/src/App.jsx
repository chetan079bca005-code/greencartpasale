import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import { Toaster } from "react-hot-toast"
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetail'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProduct'
import ProductList from './pages/seller/ProductList'
import EditProduct from './pages/seller/EditProduct'
import Orders from './pages/seller/Orders'
import Messages from './pages/seller/Messages'
import Loading from './components/Loading'
import Contact from './pages/Contact'
import FAQs from './pages/FAQs'
import Delivery from './pages/Delivery'
import Returns from './pages/Returns'
import Payment from './pages/Payment'
import TrackOrder from './pages/TrackOrder'
import Shop from './pages/Shop'
import About from './pages/About'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import WhatsAppButton from './components/WhatsAppButton'

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller")
  const { showUserLogin, isSeller } = useAppContext()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-500">
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />

      <div className={`flex-grow ${isSellerPath ? "" : ""}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/about' element={<About />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/loader' element={<Loading />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/notifications' element={<Notifications />} />

          {/* Footer Links Routes */}
          <Route path='/contact' element={<Contact />} />
          <Route path='/faqs' element={<FAQs />} />
          <Route path='/delivery' element={<Delivery />} />
          <Route path='/returns' element={<Returns />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/track-order' element={<TrackOrder />} />
          <Route path='/payment-success' element={<PaymentSuccess />} />
          <Route path='/payment-failure' element={<PaymentFailure />} />

          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='edit-product' element={<EditProduct />} />
            <Route path='orders' element={<Orders />} />
            <Route path='messages' element={<Messages />} />
          </Route>
        </Routes>
      </div>

      {!isSellerPath && <Footer />}
      {!isSellerPath && <WhatsAppButton />}
    </div>
  )
}

export default App