import { GOOGLE_CLIENT_ID } from '../../core/constants'
import useEphemeralKeyPair from '../../core/useEphemeralKeyPair'
import GoogleLogo from '../../../public/assets/GoogleLogo'

function LoginPage() {
  const ephemeralKeyPair = useEphemeralKeyPair()

  const redirectUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')

  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     *
     * window.location.origin == http://localhost:5173
     */
    redirect_uri: `http://localhost:3000/CallbackPage`,
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs as it does not require a backend server.
     */
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce: ephemeralKeyPair.nonce,
  })
  redirectUrl.search = searchParams.toString()

  const openPopup = () => {
    const popup = window.open(redirectUrl, '“popup', 'popup=true')
    if (popup) {
      const checkPopup = setInterval(() => {
        if (popup?.window?.location?.href?.includes('id_token')) {
          popup.close()
          window.location.replace(popup.window.location.href)
        }
        if (!popup || !popup.closed) return
        clearInterval(checkPopup)
      }, 1000)
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center px-4">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Welcome to Move Money</h1>
        <p className="mb-8 text-lg">
          Sign in with your Google account to continue
        </p>
        <button
          onClick={openPopup}
          className="flex w-full items-center justify-center rounded-lg border px-8 py-2 transition-all hover:bg-gray-100 hover:shadow-sm active:scale-95 active:bg-gray-50"
        >
          <GoogleLogo />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

export default LoginPage
