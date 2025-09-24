# 🚀 Guía de Despliegue en Producción - EduPlatform

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Despliegue con Docker](#despliegue-con-docker)
- [Configuración de SSL](#configuración-de-ssl)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Backup y Restauración](#backup-y-restauración)
- [Mantenimiento](#mantenimiento)
- [Troubleshooting](#troubleshooting)

## 🔧 Requisitos Previos

### Software Necesario
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Dominio configurado con DNS

### Recursos del Servidor
- **Mínimo**: 2 CPU, 4GB RAM, 20GB almacenamiento
- **Recomendado**: 4 CPU, 8GB RAM, 50GB almacenamiento
- **Producción**: 8 CPU, 16GB RAM, 100GB almacenamiento

## ⚙️ Configuración de Variables de Entorno

### 1. Backend (.env)

```bash
# Copiar archivo de ejemplo
cp backend/.env.example backend/.env
```

**Variables críticas a configurar:**

```bash
# Base de datos (usar MongoDB Atlas en producción)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elearning-platform

# JWT (generar clave segura)
JWT_SECRET=tu_clave_super_segura_minimo_32_caracteres

# Stripe (usar claves live)
STRIPE_SECRET_KEY=sk_live_tu_clave_stripe
STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica_stripe
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# CORS
CORS_ORIGIN=https://tudominio.com,https://www.tudominio.com

# Entorno
NODE_ENV=production
```

### 2. Frontend (.env)

```bash
# Copiar archivo de ejemplo
cp frontend/.env.example frontend/.env
```

```bash
# API URL
REACT_APP_API_URL=https://api.tudominio.com/api

# Stripe
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica_stripe

# Aplicación
REACT_APP_BASE_URL=https://tudominio.com
```

### 3. Docker Compose (.env.prod)

```bash
# Crear archivo de variables para Docker
cp .env.prod.example .env.prod
```

```bash
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password_super_seguro

# Redis
REDIS_PASSWORD=redis_password_seguro

# SSL
DOMAIN=tudominio.com
SSL_EMAIL=admin@tudominio.com

# Monitoreo
GRAFANA_PASSWORD=grafana_password_seguro

# AWS (para backups)
AWS_ACCESS_KEY_ID=tu_aws_key
AWS_SECRET_ACCESS_KEY=tu_aws_secret
BACKUP_S3_BUCKET=tu-bucket-backup
```

## 🐳 Despliegue con Docker

### 1. Preparación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/eduplatform.git
cd eduplatform

# Configurar variables de entorno
# (seguir pasos anteriores)
```

### 2. Build y Deploy

```bash
# Construir imágenes
docker-compose -f docker-compose.prod.yml build

# Iniciar servicios
docker-compose -f docker-compose.prod.yml up -d

# Verificar estado
docker-compose -f docker-compose.prod.yml ps
```

### 3. Verificación

```bash
# Verificar logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Verificar health checks
curl http://localhost/health
curl http://localhost:5000/api/health
```

## 🔒 Configuración de SSL

### 1. Certificados Let's Encrypt

```bash
# Generar certificados iniciales
docker-compose -f docker-compose.prod.yml run --rm certbot \
  certonly --webroot --webroot-path=/var/www/html \
  --email admin@tudominio.com --agree-tos --no-eff-email \
  -d tudominio.com -d www.tudominio.com
```

### 2. Configurar Nginx para HTTPS

```bash
# Editar nginx.conf y descomentar sección HTTPS
# Reiniciar nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### 3. Renovación Automática

```bash
# Agregar cron job para renovación
0 12 * * * docker-compose -f /ruta/a/tu/proyecto/docker-compose.prod.yml run --rm certbot renew
```

## 📊 Monitoreo y Logs

### 1. Acceso a Dashboards

- **Grafana**: http://tudominio.com:3001
- **Prometheus**: http://tudominio.com:9090

### 2. Configuración de Alertas

```bash
# Configurar alertas en Grafana
# 1. CPU > 80%
# 2. Memoria > 85%
# 3. Disco > 90%
# 4. Respuesta API > 2s
# 5. Errores 5xx > 5%
```

### 3. Logs Centralizados

```bash
# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f

# Logs específicos
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs mongodb
```

## 💾 Backup y Restauración

### 1. Backup Automático

```bash
# El servicio de backup se ejecuta automáticamente
# Configurado en docker-compose.prod.yml

# Backup manual
docker-compose -f docker-compose.prod.yml exec backup /app/backup.sh
```

### 2. Restauración

```bash
# Listar backups disponibles
docker-compose -f docker-compose.prod.yml exec backup ls /app/backups

# Restaurar backup específico
docker-compose -f docker-compose.prod.yml exec backup /app/restore.sh backup_20240101_120000.tar.gz
```

### 3. Backup Manual de Base de Datos

```bash
# Crear backup
docker-compose -f docker-compose.prod.yml exec mongodb mongodump --out /data/backup

# Restaurar backup
docker-compose -f docker-compose.prod.yml exec mongodb mongorestore /data/backup
```

## 🔧 Mantenimiento

### 1. Actualizaciones

```bash
# Actualizar código
git pull origin main

# Reconstruir imágenes
docker-compose -f docker-compose.prod.yml build

# Actualizar servicios (zero-downtime)
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Escalado

```bash
# Escalar backend
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# Verificar instancias
docker-compose -f docker-compose.prod.yml ps
```

### 3. Limpieza

```bash
# Limpiar imágenes no utilizadas
docker system prune -a

# Limpiar volúmenes no utilizados
docker volume prune
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Servicio no inicia

```bash
# Verificar logs
docker-compose -f docker-compose.prod.yml logs [servicio]

# Verificar configuración
docker-compose -f docker-compose.prod.yml config

# Reiniciar servicio específico
docker-compose -f docker-compose.prod.yml restart [servicio]
```

#### 2. Base de datos no conecta

```bash
# Verificar estado de MongoDB
docker-compose -f docker-compose.prod.yml exec mongodb mongo --eval "db.adminCommand('ismaster')"

# Verificar variables de entorno
docker-compose -f docker-compose.prod.yml exec backend env | grep MONGODB
```

#### 3. SSL no funciona

```bash
# Verificar certificados
docker-compose -f docker-compose.prod.yml exec nginx ls -la /etc/ssl/certs/

# Verificar configuración nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

#### 4. Alto uso de recursos

```bash
# Verificar uso de recursos
docker stats

# Verificar logs de errores
docker-compose -f docker-compose.prod.yml logs | grep ERROR
```

### Comandos Útiles

```bash
# Estado general
docker-compose -f docker-compose.prod.yml ps

# Uso de recursos
docker stats --no-stream

# Información del sistema
docker system df

# Verificar conectividad
curl -I https://tudominio.com
curl -I https://tudominio.com/api/health

# Verificar base de datos
docker-compose -f docker-compose.prod.yml exec mongodb mongo --eval "db.stats()"
```

## 📞 Soporte

### Contactos de Emergencia
- **DevOps**: devops@tudominio.com
- **Backend**: backend@tudominio.com
- **Frontend**: frontend@tudominio.com

### Documentación Adicional
- [API Documentation](https://api.tudominio.com/docs)
- [User Manual](https://docs.tudominio.com)
- [Architecture Guide](./docs/architecture.md)

---

## 📝 Notas Importantes

1. **Seguridad**: Cambiar todas las contraseñas por defecto
2. **Backup**: Verificar backups regularmente
3. **Monitoreo**: Configurar alertas apropiadas
4. **SSL**: Renovar certificados antes de expiración
5. **Actualizaciones**: Mantener dependencias actualizadas
6. **Logs**: Rotar logs para evitar llenar disco
7. **Performance**: Monitorear métricas de rendimiento
8. **Escalabilidad**: Planificar crecimiento de recursos

---

**Última actualización**: $(date)
**Versión**: 1.0.0
**Mantenido por**: EduPlatform DevOps Team