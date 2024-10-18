  import { Injectable } from '@angular/core';
  import { PlanillasService } from '../planillas/planillas.service';
  import { HttpClient } from '@angular/common/http';
  import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

  @Injectable({
    providedIn: 'root'
  })
  export class PdfReportPlanillasService {

    constructor(
      private http: HttpClient,
      private planillaService: PlanillasService
    ) { }
    public async createPdf(planillaId: string) {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);
      const { width, height } = page.getSize();
      const fontSize = 10;
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      page.setFont(timesRomanFont);
      page.setFontSize(fontSize);

      /*const logoUrl = 'assets/images/logotipo.jpeg';
      const logoResponse = await fetch(logoUrl);

      const logoArrayBuffer = await logoResponse.arrayBuffer();
      const logoImage = await pdfDoc.embedJpg(new Uint8Array(logoArrayBuffer));

      // Dimensiones y posición del logotipo
      const logoWidth = 70;
      const logoHeight = 70;
      const logoX = width - logoWidth - 50; // 20px de margen desde el borde derecho
      const logoY = height - logoHeight - 35; // 10px de margen desde el borde superior

      // Dibujar la imagen del logotipo
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoWidth,
        height: logoHeight,
      });*/

      page.drawText('Cochabamba - Bolivia', { x: 50, y: height - 40 });
      const x = 260;
      const y = height - 80;
      const fontSize2 = 16;
      const text = 'INFORME';
      page.drawText('INFORME', { x: 260, y: height - 80, size: 16   });
      const textWidth = boldFont.widthOfTextAtSize(text, fontSize2);
      const underlineThickness = 1;
      page.drawLine({
        start: { x: x, y: y - 2 },
        end: { x: x + textWidth -5, y: y - 2 },
        thickness: underlineThickness,
        color: rgb(0, 0, 0), // Color negro
      });

      const infoPlanilla = await this.planillaService.getPlanillaById(planillaId).toPromise() as any;
      console.log(infoPlanilla)
      let currentY = height - 120;

      // Si la Clase I está presente, mostrar su información
      if (infoPlanilla.claseI) {
        currentY = this.drawClaseI(page, infoPlanilla.claseI, currentY);
      }

      // Si la Clase Agua está presente, mostrar su información
      if (infoPlanilla.agua) {
        currentY = this.drawClaseAgua(page, infoPlanilla.agua, currentY);
      }

      // Si la Clase III está presente, mostrar su información
      if (infoPlanilla.claseIii) {
        currentY = this.drawClaseIii(page, infoPlanilla.claseIii, currentY);
      }

      // Si la Clase V está presente, mostrar su información
      if (infoPlanilla.claseV) {
        currentY = this.drawClaseV(page, infoPlanilla.claseV, currentY);
      }



      // Guardar el PDF generado
      const pdfBytes = await pdfDoc.save();

    // Crear un Blob y abrirlo en una nueva ventana
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
    }
    private drawClaseI(page, claseI, currentY) {
      page.drawText('Clase I:', { x: 50, y: currentY, size: 12,});
      currentY -= 20;
      page.drawText(`Número de efectivos: ${claseI.numEfectivo}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`Cantidad de días: ${claseI.cantidadDias}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`Cantidad de raciones: ${claseI.cantidadRaciones}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`Peso total de las raciones: ${claseI.pesoRacion}`, { x: 50, y: currentY, size: 10 });
      currentY -= 40; // Espacio extra antes de la siguiente sección
      return currentY;
    }

    // Método para dibujar la información de la Clase Agua
    private drawClaseAgua(page, agua, currentY) {
      const litrosPorBidon = 20;
      const litrosPorTurril = 200;
      const litrosPorGalon = 3.785;

      const turriles = Math.floor(agua.consumoTotal / litrosPorTurril);
      const bidones = Math.floor(agua.consumoTotal / litrosPorBidon);
      const galones = Math.floor(agua.consumoTotal / litrosPorGalon);
      page.drawText('Clase Agua:', { x: 50, y: currentY, size: 12});
      currentY -= 20;
      page.drawText(`Número de efectivos: ${agua.numEfectivo}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`Días con ducha: ${agua.diasConDucha}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`Días sin ducha: ${agua.diasSinDucha}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`Consumo Total: ${agua.consumoTotal}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`Turriles necesarios: ${turriles}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`Bidones necesarios: ${bidones}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`Galones necesarios: ${galones}`, { x: 50, y: currentY, size: 10 });
      currentY -= 40;
      return currentY;
    }

    // Método para dibujar la información de la Clase III
    private drawClaseIii(page, claseIii, currentY) {
      page.drawText('Clase III:', { x: 50, y: currentY, size: 12 });
      currentY -= 20;
      page.drawText(`KOP Total: ${claseIii.kopTotal}`, { x: 50, y: currentY, size: 10 });

      if(!claseIii.kopGrupo1){
        currentY -= 20;
        page.drawText(`Distancia Carretera: ${claseIii.distCarreteraComun}`, { x: 50, y: currentY, size: 10 });
        currentY -= 20;
        page.drawText(`Distancia Campo Traviesa: ${claseIii.distCampoTraviesaComun}`, { x: 50, y: currentY, size: 10 });
      }
      else{
        currentY -= 20;
        page.drawText(`Distancia Carretera Comum: ${claseIii.distCarreteraComun}`, { x: 50, y: currentY, size: 10 });
        currentY -= 20;
        page.drawText(`Distancia Campo Traviesa Comun: ${claseIii.distCampoTraviesaComun}`, { x: 50, y: currentY, size: 10 });
        currentY -= 20;
        page.drawText(`Distancia Carretera Grupo 1: ${claseIii.distCarreteraGrupo1}`, { x: 50, y: currentY, size: 10 });
        currentY -= 20;
        page.drawText(`Distancia Campo Traviesa Grupo1: ${claseIii.distCampoTraviesaGrupo1}`, { x: 50, y: currentY, size: 10 });
        currentY -= 20;
        page.drawText(`Distancia Carretera Grupo 2: ${claseIii.distCarreteraGrupo2}`, { x: 50, y: currentY, size: 10 });
        currentY -= 20;
        page.drawText(`Distancia Campo Traviesa Grupo2: ${claseIii.distCampoTraviesaGrupo2}`, { x: 50, y: currentY, size: 10 });

      }
      currentY -= 20;
      page.drawText(`Distancia de Abastecimiento: ${claseIii.distAbastecimiento}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`FDA: ${claseIii.fdaTotal}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`FDM: ${claseIii.fdmTotal}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`FMD: ${claseIii.fmdTotal}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`FS: ${claseIii.factorSeguridad}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`Combustible Total: ${claseIii.combustibleTotal}`, { x: 50, y: currentY, size: 10 });
      currentY -= 20;
      page.drawText(`Lubricantes: ${claseIii.lubricantes}`, { x: 50, y: currentY, size: 10 });
      currentY -= 40;
      return currentY;
    }

    // Método para dibujar la información de la Clase V
    private drawClaseV(page, claseV, currentY) {
      page.drawText('Clase V:', { x: 50, y: currentY, size: 12 });
      currentY -= 20;
      const cantDias = claseV.cantDias;
      const mostrarDiasSgtes = cantDias > 1;
      const diasSgtes = cantDias - 1;

      const startX = 50; // Posición inicial en X para la tabla
      const rowHeight = 20; // Altura de cada fila
      const headerHeight = 40; // Altura de las cabeceras que ocupan 2 filas

      // Límites de las columnas (x-coordinates para cada columna)
      const colCant = 150;
      const col1erDia = 200;
      const colDiasSgtes = 270;
      const colTotal = 350;
      const col10Seg = 400;
      const colSumaTotal =  450;
//+30
    // Dibujar la cabecera en dos filas
    // Fila 1 - Situación de combate
    page.drawText(claseV.situacionCombate.tipo, { x: col1erDia+5, y: currentY -8, });

    // Dibujar líneas horizontales para separar las filas de la cabecera
    page.drawLine({ start: { x: startX, y: currentY }, end: { x: colSumaTotal + 80, y: currentY } });
    page.drawLine({ start: { x: col1erDia, y: currentY-10 }, end: { x: colTotal, y: currentY-10 } });
    currentY -= rowHeight+10; // Mover la posición vertical para la segunda fila de la cabecera

    // Fila 2 - Encabezados de la tabla
    page.drawText('ARMAMENTO', { x: startX+5, y: currentY+5 });
    page.drawText('CANT.', { x: colCant+5, y: currentY+5 });
    page.drawText('1ER DIA', { x: col1erDia+5, y: currentY+5 });

    if (mostrarDiasSgtes) {
      page.drawText('DIAS SGTES.', { x: colDiasSgtes, y: currentY });
    }

    page.drawText('TOTAL', { x: colTotal+5, y: currentY+5 });
    page.drawText('10% SEG.', { x: col10Seg+5, y: currentY+5 });
    page.drawText('SUMA TOTAL', { x: colSumaTotal+5, y: currentY+5 });

    // Dibujar líneas horizontales para cerrar la cabecera
    page.drawLine({ start: { x: startX, y: currentY }, end: { x: colSumaTotal + 80, y: currentY } });
    currentY -= rowHeight; // Bajar al inicio de las filas de contenido

    // Dibujar las filas dinámicamente con los datos de las armas
    const situacionCombate = claseV.situacionCombate.armaSituacionCombate;
    claseV.claseVArmas.forEach(arma => {

      const nombreArma = arma.arma.nombre;
      const cantArmamento = arma.cantArmamento;
      const cantMunicionTotal = Math.floor(arma.cantMunicionNecesaria);
      const municion10Seguridad = Math.floor(cantMunicionTotal * 0.10);
      const sumaTotal = cantMunicionTotal;
      const armaSituacion = situacionCombate.find(arma => arma.arma.nombre === nombreArma);
      // Dibujar los datos de cada arma
      page.drawText(nombreArma, { x: startX, y: currentY });
      page.drawText(cantArmamento.toString(), { x: colCant, y: currentY });

      page.drawText(armaSituacion.primerDia.toString(), { x: col1erDia, y: currentY });

      if (mostrarDiasSgtes) {
        page.drawText(armaSituacion.diasSiguientes.toString(), { x: colDiasSgtes, y: currentY });
      }

      page.drawText(Math.floor((cantMunicionTotal*10)/11).toString(), { x: colTotal, y: currentY });
      page.drawText(Math.ceil(((cantMunicionTotal*10)/11)*0.1).toString(), { x: col10Seg, y: currentY });
      page.drawText(sumaTotal.toString(), { x: colSumaTotal, y: currentY });

      // Dibujar línea horizontal para la fila
      page.drawLine({ start: { x: startX, y: currentY }, end: { x: colSumaTotal + 80, y: currentY } });

      currentY -= rowHeight; // Bajar al inicio de la siguiente fila
    });

    // Dibujar líneas verticales para cada columna
    if (mostrarDiasSgtes) {
      const columnLines = [startX, colCant, col1erDia, colDiasSgtes, colTotal, col10Seg, colSumaTotal, colSumaTotal + 80];
    columnLines.forEach(x => {
      if(x==270){
        page.drawLine({ start: { x, y: currentY  + (rowHeight * (claseV.claseVArmas.length + 2)) }, end: { x, y: currentY + 20} });
      }
      else{
      page.drawLine({ start: { x, y: currentY+10  + (rowHeight * (claseV.claseVArmas.length + 2)) }, end: { x, y: currentY + 20} });
      }
    });


    }
    else{
      const columnLines = [startX, colCant, col1erDia, colTotal, col10Seg, colSumaTotal, colSumaTotal + 80];
    columnLines.forEach(x => {
      page.drawLine({ start: { x, y: currentY+10  + (rowHeight * (claseV.claseVArmas.length + 2)) }, end: { x, y: currentY + 20} });
    });
    }

      return currentY;
    }
}
