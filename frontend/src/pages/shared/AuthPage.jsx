import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageState } from '../../components/common/PageState'
import { useAuth } from '../../hooks/useAuth'
import { getDefaultRouteForRole } from '../../routes/routeConfig'

const authBenefits = [
  'Patient access for upload, cart, and order tracking',
  'Pharmacist access for verification and inventory operations',
  'Delivery access for dispatch and completion views',
]

export function AuthPage() {
  const { isAuthenticated, login, register, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  })
  const [loginState, setLoginState] = useState({ error: '', loading: false })
  const [registerState, setRegisterState] = useState({
    error: '',
    loading: false,
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      const nextRoute = location.state?.from ?? getDefaultRouteForRole(user.role)
      navigate(nextRoute, { replace: true })
    }
  }, [isAuthenticated, location.state, navigate, user])

  async function handleLoginSubmit(event) {
    event.preventDefault()
    setLoginState({ error: '', loading: true })

    try {
      await login(loginForm)
      setLoginState({ error: '', loading: false })
    } catch (error) {
      setLoginState({
        error: error.response?.data?.message ?? 'Login failed. Please check your credentials.',
        loading: false,
      })
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault()
    setRegisterState({ error: '', loading: true })

    try {
      await register(registerForm)
      setRegisterState({ error: '', loading: false })
    } catch (error) {
      const data = error.response?.data
      let errorMessage = data?.message ?? 'Registration failed. Please try again.'
      if (data?.validationErrors) {
        const errors = Object.values(data.validationErrors).join('. ')
        errorMessage = `${errorMessage}: ${errors}`
      }
      setRegisterState({
        error: errorMessage,
        loading: false,
      })
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-page__panel fade-in">
        <div className="auth-page__intro">
          <p className="page-hero__badge">Access Portal</p>
          <h1 className="auth-page__title">Login or register into the pharmacy workspace</h1>
          <p className="auth-page__description">
            Patients can register directly here, while seeded pharmacist and delivery accounts can log in for their dashboards.
          </p>
          <div className="auth-page__benefits">
            {authBenefits.map((benefit) => (
              <div className="auth-page__benefit" key={benefit}>
                <span />
                <p>{benefit}</p>
              </div>
            ))}
          </div>
          <div className="auth-demo">
            <p>Demo pharmacist: pharmacist@pharmacy.com / Pharma@123</p>
            <p>Demo delivery: delivery@pharmacy.com / Delivery@123</p>
          </div>
        </div>

        <div className="auth-page__cards">
          <Card
            eyebrow="Login"
            title="Return to your dashboard"
            description="Uses the backend login API and stores a temporary Basic auth session locally."
          >
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <label className="field">
                <span>Email</span>
                <input
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="name@pharmacy.com"
                  type="email"
                  value={loginForm.email}
                />
              </label>
              <label className="field">
                <span>Password</span>
                <input
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Enter password"
                  type="password"
                  value={loginForm.password}
                />
              </label>
              {loginState.error ? <PageState message={loginState.error} tone="error" /> : null}
              <Button className="auth-form__button" type="submit">
                {loginState.loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Card>

          <Card
            eyebrow="Register"
            title="Create a patient account"
            description="Registration is connected to the backend and creates a patient account immediately."
          >
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <label className="field">
                <span>Full Name</span>
                <input
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  placeholder="Enter full name"
                  type="text"
                  value={registerForm.fullName}
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  onChange={(event) =>
                    setRegisterForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="patient@pharmacy.com"
                  type="email"
                  value={registerForm.email}
                />
              </label>
              <label className="field">
                <span>Password</span>
                <input
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Create password"
                  type="password"
                  value={registerForm.password}
                />
              </label>
              <label className="field">
                <span>Phone Number</span>
                <input
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      phoneNumber: event.target.value,
                    }))
                  }
                  placeholder="Enter phone number"
                  type="text"
                  value={registerForm.phoneNumber}
                />
              </label>
              {registerState.error ? <PageState message={registerState.error} tone="error" /> : null}
              <Button className="auth-form__button" type="submit" variant="secondary">
                {registerState.loading ? 'Creating account...' : 'Register as Patient'}
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}
