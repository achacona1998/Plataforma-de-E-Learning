const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class CertificateGenerator {
  constructor() {
    this.certificatesDir = path.join(__dirname, '../../uploads/certificates');
    // Crear directorio si no existe
    if (!fs.existsSync(this.certificatesDir)) {
      fs.mkdirSync(this.certificatesDir, { recursive: true });
    }
  }

  async generateCertificate(certificateData) {
    const {
      studentName,
      courseName,
      instructorName,
      completionDate,
      verificationCode,
      certificateId
    } = certificateData;

    return new Promise((resolve, reject) => {
      try {
        // Crear nuevo documento PDF
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const fileName = `certificate_${certificateId}.pdf`;
        const filePath = path.join(this.certificatesDir, fileName);
        const stream = fs.createWriteStream(filePath);
        
        doc.pipe(stream);

        // Configurar colores
        const primaryColor = '#1e40af'; // Azul
        const secondaryColor = '#6366f1'; // Índigo
        const goldColor = '#f59e0b'; // Dorado

        // Fondo decorativo
        doc.rect(0, 0, doc.page.width, doc.page.height)
           .fill('#f8fafc');

        // Borde decorativo
        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
           .stroke(primaryColor, 3);

        doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
           .stroke(goldColor, 1);

        // Título principal
        doc.fontSize(36)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text('CERTIFICADO DE FINALIZACIÓN', 0, 100, {
             align: 'center',
             width: doc.page.width
           });

        // Línea decorativa
        doc.moveTo(200, 160)
           .lineTo(doc.page.width - 200, 160)
           .stroke(goldColor, 2);

        // Texto "Se certifica que"
        doc.fontSize(18)
           .fillColor('#374151')
           .font('Helvetica')
           .text('Se certifica que', 0, 200, {
             align: 'center',
             width: doc.page.width
           });

        // Nombre del estudiante
        doc.fontSize(32)
           .fillColor(secondaryColor)
           .font('Helvetica-Bold')
           .text(studentName, 0, 240, {
             align: 'center',
             width: doc.page.width
           });

        // Texto "ha completado exitosamente"
        doc.fontSize(18)
           .fillColor('#374151')
           .font('Helvetica')
           .text('ha completado exitosamente el curso', 0, 300, {
             align: 'center',
             width: doc.page.width
           });

        // Nombre del curso
        doc.fontSize(24)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text(courseName, 0, 340, {
             align: 'center',
             width: doc.page.width
           });

        // Fecha de finalización
        const formattedDate = new Date(completionDate).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        doc.fontSize(16)
           .fillColor('#374151')
           .font('Helvetica')
           .text(`Fecha de finalización: ${formattedDate}`, 0, 400, {
             align: 'center',
             width: doc.page.width
           });

        // Información del instructor
        doc.fontSize(14)
           .text(`Instructor: ${instructorName}`, 100, 480);

        // Código de verificación
        doc.fontSize(12)
           .fillColor('#6b7280')
           .text(`Código de verificación: ${verificationCode}`, 100, 500);

        // Sello/Logo (simulado con texto)
        doc.fontSize(20)
           .fillColor(goldColor)
           .font('Helvetica-Bold')
           .text('🎓', doc.page.width - 150, 450, {
             align: 'center',
             width: 100
           });

        doc.fontSize(12)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text('EduPlatform', doc.page.width - 150, 480, {
             align: 'center',
             width: 100
           });

        doc.fontSize(10)
           .fillColor('#6b7280')
           .font('Helvetica')
           .text('Plataforma de\nE-Learning', doc.page.width - 150, 500, {
             align: 'center',
             width: 100
           });

        // Finalizar documento
        doc.end();

        stream.on('finish', () => {
          resolve({
            success: true,
            filePath,
            fileName,
            url: `/uploads/certificates/${fileName}`
          });
        });

        stream.on('error', (error) => {
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  // Método para eliminar certificado
  deleteCertificate(fileName) {
    const filePath = path.join(this.certificatesDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }

  // Método para verificar si existe el certificado
  certificateExists(fileName) {
    const filePath = path.join(this.certificatesDir, fileName);
    return fs.existsSync(filePath);
  }
}

module.exports = new CertificateGenerator();