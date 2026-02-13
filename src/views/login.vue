<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Column - Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <h1>Välkommen Tillbaka</h1>
          <p>Logga in för att fortsätta till din dashboard</p>
        </div>
      </div>

      <!-- Right Column - Login Form -->
      <div class="login-section">
        <div class="login-card">
          <h2>Logga In</h2>
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">E-post</label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                placeholder="din@email.com"
              />
            </div>
            <div class="form-group">
              <label for="password">Lösenord</label>
              <input
                type="password"
                id="password"
                v-model="password"
                required
                placeholder="Ange ditt lösenord"
              />
            </div>
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="rememberMe" />
                <span>Kom ihåg mig</span>
              </label>
              <a href="#" class="forgot-password">Glömt lösenord?</a>
            </div>
            <div v-if="error" class="error-message">{{ error }}</div>
            <button type="submit" class="btn-primary">Logga In</button>
          </form>
          <div class="divider">
            <span>eller</span>
          </div>
          <button @click="showRegisterModal = true" class="btn-secondary">
            Skapa Nytt Konto
          </button>
        </div>
      </div>
    </div>

    <!-- Registration Modal -->
    <div v-if="showRegisterModal" class="modal-overlay" @click="showRegisterModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Skapa Nytt Konto</h2>
          <button class="close-btn" @click="showRegisterModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="registerName">Namn</label>
              <input
                type="text"
                id="registerName"
                v-model="registerName"
                required
                placeholder="Ditt namn"
              />
            </div>
            <div class="form-group">
              <label for="registerEmail">E-post</label>
              <input
                type="email"
                id="registerEmail"
                v-model="registerEmail"
                required
                placeholder="din@email.com"
              />
            </div>
            <div class="form-group">
              <label for="registerPassword">Lösenord</label>
              <input
                type="password"
                id="registerPassword"
                v-model="registerPassword"
                required
                placeholder="Välj ett lösenord"
              />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Bekräfta Lösenord</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                required
                placeholder="Bekräfta ditt lösenord"
              />
            </div>
            <div v-if="registerError" class="error-message">{{ registerError }}</div>
            <button type="submit" class="btn-primary">Skapa Konto</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Post-Registration Organization Modal -->
    <div v-if="showPostRegisterOrgModal" class="modal-overlay" @click="skipOrganization">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Välkommen!</h2>
          <button class="close-btn" @click="skipOrganization">&times;</button>
        </div>
        <div class="modal-body">
          <p style="margin-bottom: 1.5rem; color: #555;">
            Vill du skapa eller gå med i en organisation?
          </p>
          <div class="org-actions">
            <button @click="handleCreateOrgOption" class="btn-primary">Skapa Organisation</button>
            <button @click="handleJoinOrgOption" class="btn-secondary">Gå Med i Organisation</button>
          </div>
          <button @click="skipOrganization" class="btn-skip">Hoppa över</button>
        </div>
      </div>
    </div>

    <!-- Create Organization Modal (Post-Register) -->
    <div v-if="showCreateOrgModal" class="modal-overlay" @click="showCreateOrgModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Skapa Organisation</h2>
          <button class="close-btn" @click="showCreateOrgModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleCreateOrg">
            <div class="form-group">
              <label for="orgName">Organisationsnamn</label>
              <input
                type="text"
                id="orgName"
                v-model="newOrgName"
                required
                placeholder="Ange organisationsnamn"
              />
            </div>
            <div v-if="orgError" class="error-message">{{ orgError }}</div>
            <button type="submit" class="btn-primary">Skapa</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Join Organization Modal (Post-Register) -->
    <div v-if="showJoinOrgModal" class="modal-overlay" @click="showJoinOrgModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Gå Med i Organisation</h2>
          <button class="close-btn" @click="showJoinOrgModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleJoinOrg">
            <div class="form-group">
              <label for="joinCode">Inbjudningskod</label>
              <input
                type="text"
                id="joinCode"
                v-model="joinCode"
                required
                placeholder="Ange inbjudningskod"
              />
            </div>
            <div v-if="orgError" class="error-message">{{ orgError }}</div>
            <button type="submit" class="btn-primary">Gå Med</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { login, register } from '../lib/auth'

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      error: '',
      showRegisterModal: false,
      registerName: '',
      registerEmail: '',
      registerPassword: '',
      confirmPassword: '',
      registerError: '',
      showPostRegisterOrgModal: false,
      showCreateOrgModal: false,
      showJoinOrgModal: false,
      newOrgName: '',
      joinCode: '',
      orgError: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        this.error = ''
        await login(this.email, this.password, this.rememberMe)
        this.$router.push('/services')
      } catch (err: any) {
        this.error = err.message || 'Inloggning misslyckades'
      }
    },
    async handleRegister() {
      try {
        this.registerError = ''
        
        if (this.registerPassword !== this.confirmPassword) {
          this.registerError = 'Lösenorden matchar inte'
          return
        }

        await register(this.registerEmail, this.registerName, this.registerPassword, false)
        this.showRegisterModal = false
        this.showPostRegisterOrgModal = true
      } catch (err: any) {
        this.registerError = err.message || 'Registrering misslyckades'
      }
    },
    handleCreateOrgOption() {
      this.showPostRegisterOrgModal = false
      this.showCreateOrgModal = true
      this.newOrgName = ''
      this.orgError = ''
    },
    handleJoinOrgOption() {
      this.showPostRegisterOrgModal = false
      this.showJoinOrgModal = true
      this.joinCode = ''
      this.orgError = ''
    },
    async handleCreateOrg() {
      try {
        this.orgError = ''
        const response = await fetch('/api/organizations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ name: this.newOrgName })
        })
        
        if (response.ok) {
          this.showCreateOrgModal = false
          this.$router.push('/services')
        } else {
          const data = await response.json()
          this.orgError = data.error || 'Kunde inte skapa organisation'
        }
      } catch (error) {
        this.orgError = 'Ett fel uppstod'
      }
    },
    async handleJoinOrg() {
      try {
        this.orgError = ''
        const response = await fetch('/api/organizations/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ inviteCode: this.joinCode })
        })
        
        if (response.ok) {
          this.showJoinOrgModal = false
          this.$router.push('/services')
        } else {
          const data = await response.json()
          this.orgError = data.error || 'Ogiltig inbjudningskod'
        }
      } catch (error) {
        this.orgError = 'Ett fel uppstod'
      }
    },
    skipOrganization() {
      this.showPostRegisterOrgModal = false
      this.$router.push('/services')
    }
  }
})
</script>

<style scoped>
/* ...existing code... */

.btn-skip {
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.btn-skip:hover {
  color: #667eea;
}

.org-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.org-actions .btn-primary,
.org-actions .btn-secondary {
  flex: 1;
  min-width: 150px;
}
</style>
