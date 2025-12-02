<template>
  <div class="dashboard-page">
    <section class="dashboard-compact">
      <div class="container-full">
        <!-- Header -->
        <div class="header-bar">
          <div class="welcome-text">
            <h1>Dashboard</h1>
            <p>{{ organizationName }}</p>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="main-grid">
          <!-- Left Column - Financial Overview -->
          <div class="left-column">
            <!-- Financial Overview -->
            <div class="stats-compact">
              <h3 class="section-title">Ekonomisk Översikt</h3>
              <div class="stat-card-compact">
                <div class="stat-label">Kassa & Bank</div>
                <div class="stat-amount">{{ cashAndBank.toLocaleString() }} kr</div>
              </div>
              <div class="stat-card-compact income">
                <div class="stat-label">Månadens Intäkter</div>
                <div class="stat-amount">+{{ monthlyIncome.toLocaleString() }} kr</div>
              </div>
              <div class="stat-card-compact expense">
                <div class="stat-label">Månadens Utgifter</div>
                <div class="stat-amount">-{{ monthlyExpenses.toLocaleString() }} kr</div>
              </div>
              <div class="stat-card-compact" :class="monthlyResult >= 0 ? 'income' : 'expense'">
                <div class="stat-label">Resultat</div>
                <div class="stat-amount">{{ monthlyResult >= 0 ? '+' : '' }}{{ monthlyResult.toLocaleString() }} kr</div>
              </div>
            </div>

            <!-- Income Breakdown -->
            <div class="breakdown-panel">
              <h3>Intäkter (Uppdelning)</h3>
              <div class="breakdown-list">
                <div v-for="item in incomeBreakdown" :key="item.id" class="breakdown-row">
                  <span class="breakdown-label">{{ item.category }}</span>
                  <span class="breakdown-value">{{ item.amount.toLocaleString() }} kr</span>
                </div>
              </div>
            </div>

            <!-- Expense Breakdown -->
            <div class="breakdown-panel">
              <h3>Utgifter (Uppdelning)</h3>
              <div class="breakdown-list">
                <div v-for="item in expenseBreakdown" :key="item.id" class="breakdown-row">
                  <span class="breakdown-label">{{ item.category }}</span>
                  <span class="breakdown-value">{{ item.amount.toLocaleString() }} kr</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Center Column - Quick Actions -->
          <div class="center-column">
            <div class="panel">
              <div class="panel-header">
                <h3>Snabbknappar</h3>
              </div>
              <div class="quick-actions-grid">
                <button class="quick-action-card" @click="handleAction('upload-receipt')">
                  <span class="action-icon">↑</span>
                  <span class="action-text">Ladda upp Kvitto</span>
                </button>
                <button class="quick-action-card" @click="handleAction('start-accounting')">
                  <span class="action-icon">▶</span>
                  <span class="action-text">Starta Bokföring</span>
                </button>
                <button class="quick-action-card" @click="handleAction('download-accounting')">
                  <span class="action-icon">↓</span>
                  <span class="action-text">Ladda ner Bokföring</span>
                </button>
                <button class="quick-action-card" @click="handleAction('swish-payment')">
                  <span class="action-icon">$</span>
                  <span class="action-text">Swish Betalning</span>
                </button>
                <button class="quick-action-card" @click="handleAction('create-invoice')">
                  <span class="action-icon">□</span>
                  <span class="action-text">Skapa Faktura</span>
                </button>
                <button class="quick-action-card" @click="handleAction('add-member')">
                  <span class="action-icon">+</span>
                  <span class="action-text">Lägg till Medlem</span>
                </button>
                <button class="quick-action-card" @click="handleAction('record-expense')">
                  <span class="action-icon">−</span>
                  <span class="action-text">Registrera Utgift</span>
                </button>
                <button class="quick-action-card" @click="handleAction('record-income')">
                  <span class="action-icon">+</span>
                  <span class="action-text">Registrera Intäkt</span>
                </button>
              </div>
            </div>

            <!-- Member Status -->
            <div class="panel">
              <h3 class="panel-header-title">Medlemsstatus</h3>
              <div class="member-stats-compact">
                <div class="member-stat-row">
                  <span class="member-label">Totalt Medlemmar</span>
                  <span class="member-value">{{ totalMembers }}</span>
                </div>
                <div class="member-stat-row">
                  <span class="member-label">Betalat</span>
                  <span class="member-value paid">{{ paidMembers }}</span>
                </div>
                <div class="member-stat-row">
                  <span class="member-label">Obetalt</span>
                  <span class="member-value unpaid">{{ unpaidMembers }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Recent Activity & Alerts -->
          <div class="right-column">
            <div class="panel">
              <div class="panel-header">
                <h3>Senaste Aktivitet</h3>
              </div>
              <div class="activity-compact">
                <div v-for="transaction in recentTransactions.slice(0, 5)" :key="transaction.id" class="activity-row">
                  <div class="activity-info">
                    <span class="activity-name">{{ transaction.description }}</span>
                    <span class="activity-date">{{ transaction.date }}</span>
                  </div>
                  <div class="activity-amount" :class="transaction.type">
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ transaction.amount.toLocaleString() }} kr
                  </div>
                </div>
              </div>
            </div>

            <div class="panel">
              <div class="panel-header">
                <h3>Att Göra</h3>
              </div>
              <div class="alerts-compact">
                <div v-for="alert in alerts" :key="alert.id" class="alert-row" :class="alert.type">
                  <span class="alert-icon">!</span>
                  <span class="alert-text">{{ alert.message }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template><script>
export default {
  name: 'Dashboard',
  data() {
    return {
      organizationName: 'Din Förening AB',
      cashAndBank: 452500,
      monthlyIncome: 128000,
      monthlyExpenses: 83400,
      totalMembers: 127,
      paidMembers: 102,
      unpaidMembers: 25,
      recentTransactions: [
        { id: 1, type: 'income', description: 'Medlemsavgifter - December', amount: 32000, date: '1 Dec 2025' },
        { id: 2, type: 'expense', description: 'Utrustning', amount: 8500, date: '30 Nov 2025' },
        { id: 3, type: 'income', description: 'Sponsring - Lokalt företag', amount: 50000, date: '28 Nov 2025' },
        { id: 4, type: 'expense', description: 'Lokalhyra', amount: 12000, date: '27 Nov 2025' },
        { id: 5, type: 'income', description: 'Tävlingsavgifter', amount: 24000, date: '25 Nov 2025' }
      ],
      alerts: [
        { id: 1, type: 'warning', message: '25 medlemmar har ej betalat avgift' },
        { id: 2, type: 'info', message: '3 kvitton väntar på godkännande' },
        { id: 3, type: 'warning', message: '5 omatchade Swish-betalningar' }
      ],
      incomeBreakdown: [
        { id: 1, category: 'Medlemsavgifter', amount: 72000 },
        { id: 2, category: 'Sponsring', amount: 40000 },
        { id: 3, category: 'Tävlingsavgifter', amount: 12000 },
        { id: 4, category: 'Övrigt', amount: 4000 }
      ],
      expenseBreakdown: [
        { id: 1, category: 'Lokalhyra', amount: 35000 },
        { id: 2, category: 'Utrustning', amount: 28000 },
        { id: 3, category: 'Tränare', amount: 15000 },
        { id: 4, category: 'Övrigt', amount: 5400 }
      ]
    }
  },
  computed: {
    monthlyResult() {
      return this.monthlyIncome - this.monthlyExpenses
    }
  },
  methods: {
    handleAction(action) {
      console.log('Action:', action)
      alert(`Funktionen "${action}" kommer snart!`)
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  background-color: var(--background);
  min-height: calc(100vh - 60px);
  padding-top: 60px;
  overflow: hidden;
}

.dashboard-compact {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.container-full {
  max-width: 100%;
  padding: 0.5rem 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.welcome-text h1 {
  font-size: 1.3rem;
  color: var(--primary-dark);
  margin: 0;
  line-height: 1.2;
}

.welcome-text p {
  font-size: 0.8rem;
  color: var(--text-dark);
  margin: 0;
  opacity: 0.8;
}

.main-actions {
  display: flex;
  gap: 0.75rem;
}

.main-grid {
  display: grid;
  grid-template-columns: 300px 1fr 320px;
  gap: 1rem;
  flex: 1;
  min-height: 0;
}

/* Left Column */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-compact {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 0.85rem;
  color: var(--primary-dark);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card-compact {
  padding: 0.75rem;
  border-bottom: 1px solid var(--background);
}

.stat-card-compact:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-dark);
  opacity: 0.7;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-dark);
}

.stat-card-compact.income .stat-amount {
  color: #22c55e;
}

.stat-card-compact.expense .stat-amount {
  color: #ef4444;
}

.actions-panel {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  flex: 1;
}

.actions-panel h3 {
  font-size: 0.9rem;
  color: var(--primary-dark);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
}

.member-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.member-stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--background);
  border-radius: 6px;
}

.member-label {
  font-size: 0.85rem;
  color: var(--text-dark);
  font-weight: 500;
}

.member-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-dark);
}

.member-value.paid {
  color: #22c55e;
}

.member-value.unpaid {
  color: #ef4444;
}

.breakdown-panel {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.breakdown-panel h3 {
  font-size: 0.9rem;
  color: var(--primary-dark);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--background);
  border-radius: 4px;
}

.breakdown-label {
  font-size: 0.8rem;
  color: var(--text-dark);
  font-weight: 500;
}

.breakdown-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary-dark);
}

.member-stats-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.panel-header-title {
  font-size: 0.9rem;
  color: var(--primary-dark);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--background);
}

/* Center Column */
.center-column {
  display: flex;
  flex-direction: column;
}

.panel {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.center-column .panel {
  flex: 1;
  min-height: 0;
}

.panel-header {
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--background);
  margin-bottom: 0.75rem;
}

.panel-header h3 {
  font-size: 1rem;
  color: var(--primary-dark);
  margin: 0;
  font-weight: 600;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  overflow-y: auto;
  flex: 1;
}

.quick-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.75rem 0.5rem;
  background: var(--background);
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 70px;
}

.quick-action-card:hover {
  background: var(--primary-light);
  border-color: var(--primary-dark);
  transform: translateY(-2px);
}

.quick-action-card:hover .action-icon,
.quick-action-card:hover .action-text {
  color: white;
}

.action-icon {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-dark);
}

.action-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary-dark);
  text-align: center;
  line-height: 1.2;
}

.activity-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  flex: 1;
}

.activity-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--background);
  border-radius: 6px;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.activity-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--primary-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-date {
  font-size: 0.75rem;
  color: var(--text-dark);
  opacity: 0.7;
}

.activity-amount {
  font-size: 1rem;
  font-weight: 700;
  margin-left: 1rem;
  white-space: nowrap;
}

.activity-amount.income {
  color: #22c55e;
}

.activity-amount.expense {
  color: #ef4444;
}

/* Right Column */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.right-column .panel {
  flex: 1;
  min-height: 0;
}

.alerts-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  flex: 1;
}

.alert-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--background);
  border-radius: 6px;
  border-left: 3px solid transparent;
}

.alert-row.warning {
  border-left-color: #f59e0b;
  background: #fef3c7;
}

.alert-row.info {
  border-left-color: #3b82f6;
  background: #dbeafe;
}

.alert-icon {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-dark);
}

.alert-text {
  font-size: 0.85rem;
  color: var(--primary-dark);
  font-weight: 500;
}

@media (max-width: 1200px) {
  .main-grid {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .left-column,
  .right-column {
    flex-direction: row;
  }

  .stats-compact,
  .actions-panel,
  .panel {
    min-height: 200px;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
