const MECH = [['Timestamp','submittedAt'],['Full Name','fullName'],['Phone','phone'],
 ['On WhatsApp','onWhatsapp'],['Email','email'],['Garage Name','garageName'],
 ['Self-employed/Mobile','selfEmployed'],['Garage Location','garageLocation'],['Landmark','landmark'],
 ['Usually Found','usuallyFound'],['Years Experience','yearsExperience'],['Vehicles Serviced','vehicles'],
 ['Other Models','otherModels'],['Vehicles Per Month','vehiclesPerMonth'],['Hard To Find Parts','hardParts'],
 ['Part Details','partDetails'],['Buys Parts From','buysFrom'],['Biggest Buying Problem','biggestProblem'],
 ['Monthly Parts Spend','monthlySpend'],['Engine Oil Brand','oilBrand'],['Oil Litres Per Month','oilLitres'],
 ['Wants Delivery','wantsDelivery'],['Contact Method','contactMethod'],['Best Time','bestTime'],
 ['Registered By','registeredBy'],['Consent','consent'],['Device','device'],['UTM','utm'],
 ['Submission ID','submissionId']];

const FLEET = [['Timestamp','submittedAt'],['Full Name','fullName'],['Phone','phone'],
 ['On WhatsApp','onWhatsapp'],['Email','email'],['Company','companyName'],['Role','roleInCompany'],
 ['Business Type','businessType'],['Yard Location','yardLocation'],['Fleet Size','fleetSize'],
 ['Vehicle Models','vehicleModels'],['Other Models','otherModels'],['Vehicle Age','vehicleAge'],
 ['Type Of Work','operations'],['Serviced By','maintenanceBy'],['Mechanic/Garage','mechanicName'],
 ['Mechanic Phone','mechanicPhone'],['Garage Location','garageLocation'],['Buys Parts From','partsBoughtFrom'],
 ['Parts Replaced Often','partsReplacedOften'],['Parts To Save Cost','savingParts'],
 ['Biggest Problem','biggestProblem'],['Payment Terms','paymentTerms'],['Monthly Parts Spend','monthlyPartsSpend'],
 ['Oil Type','oilType'],['Oil Brand','oilBrand'],['Oil Bought From','oilBoughtFrom'],
 ['Oil Per Month','oilQuantity'],['Oil Pack Size','packSize'],['Wants Quote','wantsQuote'],
 ['Wants Delivery','wantsDelivery'],['Contact Method','contactMethod'],['Best Time','bestTime'],
 ['Registered By','registeredBy'],['Consent','consent'],['Device','device'],['UTM','utm'],
 ['Submission ID','submissionId']];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse(e.postData.contents);
    if (d.website) return out({ ok: true });              // honeypot: bots filled it
    const isFleet = d.registrantType === 'fleet';
    const spec = isFleet ? FLEET : MECH;
    const sh = getSheet(isFleet ? 'Fleets' : 'Mechanics', spec);
    const idCol = spec.length;
    const last = sh.getLastRow();
    if (last > 1) {                                       // ignore duplicate retries
      const ids = sh.getRange(2, idCol, last - 1, 1).getValues().flat();
      if (ids.indexOf(d.submissionId) !== -1) return out({ ok: true, duplicate: true });
    }
    sh.appendRow(spec.map(c => val(d[c[1]])));
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet(name, spec) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(spec.map(c => c[0]));
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, spec.length).setFontWeight('bold');
    spec.forEach((c, i) => {                              // keep phone numbers as text
      if (c[1] === 'phone' || c[1] === 'mechanicPhone') sh.getRange(1, i + 1, sh.getMaxRows(), 1).setNumberFormat('@');
    });
  }
  return sh;
}

function val(v) {
  if (v === undefined || v === null) return '';
  return Array.isArray(v) ? v.join(', ') : v;
}
function doGet() { return out({ status: 'Mangu Auto activation endpoint is live' }); }
function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
