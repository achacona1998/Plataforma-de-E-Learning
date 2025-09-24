import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../layout/AdminLayout';
import { useApi } from '../../hooks/useApi';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  ServerIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdminSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'EduPlatform',
      siteDescription: 'Plataforma de aprendizaje en línea',
      siteUrl: 'https://eduplatform.com',
      adminEmail: 'admin@eduplatform.com',
      timezone: 'America/Mexico_City',
      language: 'es',
      maintenanceMode: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      newUserRegistration: true,
      courseCompletion: true,
      paymentReceived: true,
      systemAlerts: true
    },
    security: {
      twoFactorAuth: false,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      ipWhitelist: '',
      sslRequired: true
    },
    payment: {
      currency: 'USD',
      taxRate: 16,
      paypalEnabled: true,
      stripeEnabled: true,
      bankTransferEnabled: false,
      refundPolicy: '30 días'
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: 'noreply@eduplatform.com',
      fromName: 'EduPlatform'
    },
    system: {
      backupFrequency: 'daily',
      logLevel: 'info',
      cacheEnabled: true,
      compressionEnabled: true,
      maxFileSize: 50,
      allowedFileTypes: 'pdf,doc,docx,ppt,pptx,jpg,png,gif'
    }
  });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Usar useApi para obtener configuraciones
  const { data: settingsData, loading: fetchingSettings, error: fetchError, refetch } = useApi('/api/configuracion');

  useEffect(() => {
    if (settingsData?.data) {
      setSettings(settingsData.data);
    }
  }, [settingsData]);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = async (category) => {
    try {
      setLoading(true);
      setSaveStatus('');
      
      const { useApi } = await import('../../hooks/useApi');
      const response = await fetch('/api/configuracion', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [category]: settings[category] })
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar configuración');
      }
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
      await refetch(); // Refrescar datos
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
    { id: 'security', name: 'Seguridad', icon: ShieldCheckIcon },
    { id: 'payment', name: 'Pagos', icon: CurrencyDollarIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'system', name: 'Sistema', icon: ServerIcon }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Nombre del Sitio</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Email del Administrador</label>
          <input
            type="email"
            value={settings.general.adminEmail}
            onChange={(e) => handleSettingChange('general', 'adminEmail', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Descripción del Sitio</label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">URL del Sitio</label>
          <input
            type="url"
            value={settings.general.siteUrl}
            onChange={(e) => handleSettingChange('general', 'siteUrl', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Zona Horaria</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="America/Mexico_City">México (GMT-6)</option>
            <option value="America/New_York">Nueva York (GMT-5)</option>
            <option value="Europe/Madrid">Madrid (GMT+1)</option>
            <option value="Asia/Tokyo">Tokio (GMT+9)</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">Modo de Mantenimiento</label>
          <p className="text-sm text-gray-500">Activar para realizar mantenimiento del sitio</p>
        </div>
        <button
          onClick={() => handleSettingChange('general', 'maintenanceMode', !settings.general.maintenanceMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.general.maintenanceMode ? 'bg-teal-600' : 'bg-gray-200'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            settings.general.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <div key={key} className="flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <p className="text-sm text-gray-500">
              {key === 'emailNotifications' && 'Enviar notificaciones por email'}
              {key === 'pushNotifications' && 'Enviar notificaciones push'}
              {key === 'smsNotifications' && 'Enviar notificaciones por SMS'}
              {key === 'newUserRegistration' && 'Notificar cuando se registre un nuevo usuario'}
              {key === 'courseCompletion' && 'Notificar cuando se complete un curso'}
              {key === 'paymentReceived' && 'Notificar cuando se reciba un pago'}
              {key === 'systemAlerts' && 'Notificar alertas del sistema'}
            </p>
          </div>
          <button
            onClick={() => handleSettingChange('notifications', key, !value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              value ? 'bg-teal-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      ))}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">Autenticación de Dos Factores</label>
          <p className="text-sm text-gray-500">Requerir 2FA para todos los administradores</p>
        </div>
        <button
          onClick={() => handleSettingChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.security.twoFactorAuth ? 'bg-teal-600' : 'bg-gray-200'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Expiración de Contraseña (días)</label>
          <input
            type="number"
            value={settings.security.passwordExpiry}
            onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Máximo Intentos de Login</label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Lista Blanca de IPs</label>
        <textarea
          value={settings.security.ipWhitelist}
          onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.value)}
          placeholder="192.168.1.1, 10.0.0.1"
          rows={3}
          className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Moneda</label>
          <select
            value={settings.payment.currency}
            onChange={(e) => handleSettingChange('payment', 'currency', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="USD">USD - Dólar Americano</option>
            <option value="MXN">MXN - Peso Mexicano</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Tasa de Impuesto (%)</label>
          <input
            type="number"
            value={settings.payment.taxRate}
            onChange={(e) => handleSettingChange('payment', 'taxRate', parseFloat(e.target.value))}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Métodos de Pago</h4>
        
        {['paypalEnabled', 'stripeEnabled', 'bankTransferEnabled'].map((method) => (
          <div key={method} className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {method.replace('Enabled', '').replace(/([A-Z])/g, ' $1').trim()}
              </label>
            </div>
            <button
              onClick={() => handleSettingChange('payment', method, !settings.payment[method])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.payment[method] ? 'bg-teal-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.payment[method] ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Servidor SMTP</label>
          <input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Puerto SMTP</label>
          <input
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Usuario SMTP</label>
          <input
            type="text"
            value={settings.email.smtpUsername}
            onChange={(e) => handleSettingChange('email', 'smtpUsername', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Contraseña SMTP</label>
          <input
            type="password"
            value={settings.email.smtpPassword}
            onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Email Remitente</label>
          <input
            type="email"
            value={settings.email.fromEmail}
            onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Nombre Remitente</label>
          <input
            type="text"
            value={settings.email.fromName}
            onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Frecuencia de Respaldo</label>
          <select
            value={settings.system.backupFrequency}
            onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="hourly">Cada hora</option>
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Nivel de Log</label>
          <select
            value={settings.system.logLevel}
            onChange={(e) => handleSettingChange('system', 'logLevel', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Tamaño Máximo de Archivo (MB)</label>
        <input
          type="number"
          value={settings.system.maxFileSize}
          onChange={(e) => handleSettingChange('system', 'maxFileSize', parseInt(e.target.value))}
          className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Tipos de Archivo Permitidos</label>
        <input
          type="text"
          value={settings.system.allowedFileTypes}
          onChange={(e) => handleSettingChange('system', 'allowedFileTypes', e.target.value)}
          placeholder="pdf,doc,docx,jpg,png"
          className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div className="space-y-4">
        {['cacheEnabled', 'compressionEnabled'].map((setting) => (
          <div key={setting} className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {setting.replace('Enabled', '').replace(/([A-Z])/g, ' $1').trim()}
              </label>
            </div>
            <button
              onClick={() => handleSettingChange('system', setting, !settings.system[setting])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.system[setting] ? 'bg-teal-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.system[setting] ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'payment':
        return renderPaymentSettings();
      case 'email':
        return renderEmailSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="overflow-hidden relative p-8 bg-gradient-to-br via-blue-50 to-indigo-100 rounded-3xl border shadow-lg from-slate-50 border-slate-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br rounded-full translate-x-32 -translate-y-32 from-blue-400/10 to-indigo-600/10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr rounded-full -translate-x-24 translate-y-24 from-slate-400/10 to-blue-500/10"></div>
            
            <div className="flex relative z-10 justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-br to-blue-600 rounded-2xl shadow-lg from-slate-500">
                  <CogIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r to-blue-700 from-slate-700">
                    ⚙️ Configuración del Sistema
                  </h1>
                  <p className="text-lg text-slate-600">Administra y personaliza la configuración de la plataforma</p>
                  <div className="flex items-center mt-2 text-sm text-slate-500">
                    <ClockIcon className="mr-2 w-4 h-4" />
                    <span>Última actualización: {new Date().toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>
              {saveStatus && (
                <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl shadow-lg border ${
                  saveStatus === 'success' 
                    ? 'bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-800 border-emerald-200' 
                    : 'bg-gradient-to-r from-red-50 to-rose-100 text-red-800 border-red-200'
                }`}>
                  {saveStatus === 'success' ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <XMarkIcon className="w-5 h-5" />
                  )}
                  <span className="font-semibold">
                    {saveStatus === 'success' ? '✅ Configuración guardada exitosamente' : '❌ Error al guardar la configuración'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="p-6 bg-gradient-to-br from-white rounded-2xl border shadow-lg to-slate-50 border-slate-200">
              <h3 className="flex items-center mb-6 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r to-blue-700 from-slate-700">
                <CogIcon className="mr-2 w-5 h-5 text-slate-600" />
                🔧 Configuraciones
              </h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-4 px-4 py-4 text-left rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg border-l-4 border-blue-300'
                        : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-blue-50 hover:shadow-md border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      activeTab === tab.id 
                        ? 'bg-white/20' 
                        : 'bg-gradient-to-br from-slate-100 to-slate-200'
                    }`}>
                      <tab.icon className={`h-5 w-5 ${
                        activeTab === tab.id ? 'text-white' : 'text-slate-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <span className={`font-semibold ${
                        activeTab === tab.id ? 'text-white' : 'text-slate-700'
                      }`}>
                        {tab.id === 'general' && '⚙️ '}
                        {tab.id === 'notifications' && '🔔 '}
                        {tab.id === 'security' && '🔒 '}
                        {tab.id === 'payment' && '💳 '}
                        {tab.id === 'email' && '📧 '}
                        {tab.id === 'system' && '🖥️ '}
                        {tab.name}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-3/4">
            <div className="p-8 bg-gradient-to-br from-white rounded-2xl border shadow-xl to-slate-50 border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    {(() => {
                      const activeTabData = tabs.find(tab => tab.id === activeTab);
                      const IconComponent = activeTabData?.icon;
                      return IconComponent ? <IconComponent className="w-6 h-6 text-white" /> : null;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r to-blue-700 from-slate-700">
                      {tabs.find(tab => tab.id === activeTab)?.name}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {activeTab === 'general' && 'Configuración básica de la plataforma'}
                      {activeTab === 'notifications' && 'Gestión de notificaciones del sistema'}
                      {activeTab === 'security' && 'Configuración de seguridad y acceso'}
                      {activeTab === 'payment' && 'Configuración de métodos de pago'}
                      {activeTab === 'email' && 'Configuración del servidor de correo'}
                      {activeTab === 'system' && 'Configuración del sistema y rendimiento'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => saveSettings(activeTab)}
                  disabled={loading}
                  className="flex items-center px-6 py-3 space-x-3 font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl transition-all duration-300 transform hover:from-emerald-600 hover:to-green-700 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  ) : (
                    <CheckIcon className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Guardando...' : '💾 Guardar Cambios'}</span>
                </button>
              </div>
              
              <div className="p-6 bg-white rounded-xl border shadow-sm border-slate-100">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
