/* eslint-disable prettier/prettier */
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Alert } from 'react-native';
import { formatTime, formatDate } from './format.helper';
 const generatePdf = async (htmlContent) => {
    let options = {
        html: htmlContent,
        file: 'export_Pdf',
        directory: 'OrangeMoon'
    }

    let file = await RNHTMLtoPDF.convert(options)
    console.log("pdf file  generated", file)
    Alert.alert('Successfully Exported', 'Path:' + file.filePath, [
        { text: 'Cancel', style: 'cancel' },
    ], { cancelable: true });
}
export const pdfGenerator=(bookingDayDetails,monitorBookingDayReport, data, activitydata, incRows)=>{
   generatePdf(generateHTML(bookingDayDetails,monitorBookingDayReport, data, activitydata, incRows))
}
export const generateHTML = (bookingDayDetails,monitorBookingDayReport, data, activitydata, incRows) => {
    let tableRows = '';
    data.forEach((item, index) => {
        tableRows += `
        <tr key="${index}">
          <td>"${item?.monitor_precheck_question?.question}"</td>
          <td>"${item?.status}"</td>
          <td>"${item?.description}"</td>            
        </tr>
      `;
    });
    let activityRows = '';
    activitydata.forEach((item, index) => {
        activityRows += `
        <div key= "${index}">
          Start Time: "${formatTime(item?.start_Time)}"
          End Time: "${formatTime(item?.end_time)}
          Current Address: "${item.current_address}"
          Description: "${item.description}"
        </div>
        `
    })
    let incidentRowsData = '';
    incRows.forEach((item, index) => {
        incidentRowsData += `
        <div key= "${index}">
          Id: "${item?.id}"
          Location: "${item?.location}"
          Description: "${item.description}"
          Rooms: "${item?.rooms}"
          Student: "${item?.students}".
          Well Descriptions:"${item?.witness_description}"
          Created_At :"${formatDate(item?.created_at)}"
          Time: "${formatTime(item?.time)}"
        </div>
        `
    })
    return `
    <html>
       <body>
         <table>
             <tbody>
                <tr>
                     <td style="border:1px solid #000; text-align:center;">Nightly Activity Report </td>
                </tr>
                <tr>
                     <td>Monitor Name:${bookingDayDetails?.first_name || '-'}</td>
                </tr>
                <tr>
                     <td>Date: ${bookingDayDetails?.date || '-'}</td>
                </tr>
                <tr>
                     <td>Group Name: ${bookingDayDetails?.group_name || '-'}</td>
                </tr>
                <tr>
                      <td> # Of Students:${bookingDayDetails?.no_of_students || '-'}</td>
                </tr>
                <tr>
                     <td> # Of Floors:${bookingDayDetails?.no_of_floor || '-'} </td>
                </tr>
                <tr>
                     <td> TD/GL Name:${bookingDayDetails?.gl_name || '-'} </td>
                </tr>
                <tr>
                     <td> Start Time:${monitorBookingDayReport?.start_time || '-'} </td>
                </tr>
                <tr>
                      <td> End Time: ${monitorBookingDayReport?.end_time || '-'} </td>  
                 </tr>
                <tr>
                   <td style="border:1px solid #000; text-align:center;">Pre-Checks:</td>
                </tr>
                <tr>
                   <td>Pre-Check Question:</td>
                   <td>Status:</td>
                   <td>Pre-Check-Memo:</td>
                </tr>
                ${tableRows}
               <tr>
                 <td style="border:1px solid #000; text-align:center;">Activity:</td>
                </tr>
               <tr>
                <td>${activityRows}</td>
               </tr>
               <tr>
                 <td style="border:1px solid #000; text-align:center;">Incident:</td>
                </tr>
                <tr>
                  <td>${incidentRowsData}</td>
                </tr>
            </tbody>
        </table>
     </body>
  </html>`

};