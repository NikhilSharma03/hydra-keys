import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import Footer from '../components/Footer'
import { Provider } from 'react-redux'
import { store } from '../redux/store/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Footer />
    </Provider>
  )
}

export default MyApp
