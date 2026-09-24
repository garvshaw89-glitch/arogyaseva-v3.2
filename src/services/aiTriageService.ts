import { Vitals, SymptomsData, UrgencyLevel } from '../types';

export interface AITriageResult {
  urgency: UrgencyLevel;
  redFlags: string[];
  summary: string;
  recommendedAction: string;
}

export class AITriageService {
  /**
   * Analyze clinical intake vitals and symptoms to compute triage urgency & clinical summary
   */
  public static analyzeCase(vitals: Vitals, symptoms: SymptomsData, voiceNote?: string): AITriageResult {
    const redFlags: string[] = [];

    // 1. SpO2 Hypoxia Check
    if (vitals.spO2 < 90) {
      redFlags.push(`CRITICAL HYPOXIA: SpO2 is ${vitals.spO2}% (<90%)`);
    } else if (vitals.spO2 <= 93) {
      redFlags.push(`Moderate Hypoxia: SpO2 is ${vitals.spO2}% (90-93%)`);
    }

    // 2. Blood Pressure Check
    if (vitals.bloodPressureSys >= 160 || vitals.bloodPressureDia >= 100) {
      redFlags.push(`HYPERTENSIVE CRISIS: BP ${vitals.bloodPressureSys}/${vitals.bloodPressureDia} mmHg`);
    } else if (vitals.bloodPressureSys <= 90 || vitals.bloodPressureDia <= 60) {
      redFlags.push(`HYPOTENSION / SHOCK RISK: BP ${vitals.bloodPressureSys}/${vitals.bloodPressureDia} mmHg`);
    }

    // 3. Heart Rate Check
    if (vitals.heartRate >= 120) {
      redFlags.push(`SEVERE TACHYCARDIA: Heart rate ${vitals.heartRate} bpm`);
    } else if (vitals.heartRate <= 50) {
      redFlags.push(`BRADYCARDIA: Heart rate ${vitals.heartRate} bpm`);
    }

    // 4. Temperature Check
    if (vitals.temperature >= 103) {
      redFlags.push(`HIGH FEVER (HYPERPYREXIA): Temp ${vitals.temperature}°F`);
    }

    // 5. Respiratory Rate
    if (vitals.respiratoryRate >= 26) {
      redFlags.push(`TACHYPNEA / RESPIRATORY DISTRESS: ${vitals.respiratoryRate} breaths/min`);
    }

    // 6. Symptom Red Flags
    const complaintLower = (symptoms.chiefComplaint + ' ' + (voiceNote || '')).toLowerCase();
    if (complaintLower.includes('chest pain') || complaintLower.includes('arm tightness') || complaintLower.includes('heart attack')) {
      redFlags.push('POSSIBLE ACUTE CORONARY SYNDROME (Chest Pain)');
    }
    if (complaintLower.includes('unconscious') || complaintLower.includes('seizure') || complaintLower.includes('fainted')) {
      redFlags.push('ALTERED MENTAL STATUS / NEUROLOGICAL EMERGENCY');
    }
    if (complaintLower.includes('snake') || complaintLower.includes('bite') || complaintLower.includes('poison')) {
      redFlags.push('ENVENOMATION / TOXICOLOGICAL EMERGENCY');
    }
    if (complaintLower.includes('bleeding') || complaintLower.includes('hemorrhage') || complaintLower.includes('accident')) {
      redFlags.push('ACUTE TRAUMA / SEVERE BLEEDING');
    }

    // Determine Urgency Level
    let urgency: UrgencyLevel = 'LOW';
    if (redFlags.length >= 3 || vitals.spO2 < 90 || complaintLower.includes('unconscious') || complaintLower.includes('snake')) {
      urgency = 'CRITICAL';
    } else if (redFlags.length >= 1 || vitals.spO2 <= 93 || vitals.bloodPressureSys >= 150) {
      urgency = 'URGENT';
    } else if (symptoms.severity === 'Severe' || symptoms.durationDays >= 5) {
      urgency = 'MODERATE';
    }

    // Generate Clinical Summary
    const summary = `AI Clinical Synthesis: ${urgency} risk case. Chief complaint: "${symptoms.chiefComplaint}". ` +
      `Vitals: BP ${vitals.bloodPressureSys}/${vitals.bloodPressureDia} mmHg, HR ${vitals.heartRate} bpm, SpO2 ${vitals.spO2}%, Temp ${vitals.temperature}°F. ` +
      (redFlags.length > 0 ? `Red Flags Identified: [${redFlags.join(' | ')}]. ` : 'Vitals within baseline limits. ') +
      `Note: AI assessment is for triage prioritization only and does not replace doctor evaluation.`;

    const recommendedAction = urgency === 'CRITICAL' || urgency === 'URGENT'
      ? 'Immediate Doctor Review Required. Prepare Emergency Oxygen / First Aid and identify nearest District Hospital ICU.'
      : 'Standard Clinical Review. Maintain tele-consultation log and advise CHW follow-up.';

    return {
      urgency,
      redFlags,
      summary,
      recommendedAction
    };
  }

  /**
   * Parse raw spoken voice transcript into structured clinical fields
   */
  public static parseVoiceTranscript(transcript: string): Partial<SymptomsData & { vitals: Partial<Vitals> }> {
    const text = transcript.toLowerCase();
    const result: Partial<SymptomsData & { vitals: Partial<Vitals> }> = {
      symptoms: [],
      vitals: {}
    };

    if (text.includes('fever') || text.includes('high temperature')) result.symptoms?.push('Fever');
    if (text.includes('cough') || text.includes('coughing')) result.symptoms?.push('Cough');
    if (text.includes('breath') || text.includes('breathing difficulty')) result.symptoms?.push('Breathlessness');
    if (text.includes('chest pain') || text.includes('chest tightness')) result.symptoms?.push('Chest Pain');
    if (text.includes('vomit') || text.includes('nausea')) result.symptoms?.push('Vomiting');
    if (text.includes('headache') || text.includes('head pain')) result.symptoms?.push('Headache');
    if (text.includes('diarrhea') || text.includes('loose motion')) result.symptoms?.push('Diarrhea');

    // Extract numbers for temperature, blood pressure, SpO2 if spoken
    const bpMatch = text.match(/bp\s*(\d{2,3})\s*(over|\/)\s*(\d{2,3})/);
    if (bpMatch) {
      result.vitals!.bloodPressureSys = parseInt(bpMatch[1], 10);
      result.vitals!.bloodPressureDia = parseInt(bpMatch[3], 10);
    }

    const spo2Match = text.match(/spo2\s*(\d{2,3})|oxygen\s*(\d{2,3})/);
    if (spo2Match) {
      result.vitals!.spO2 = parseInt(spo2Match[1] || spo2Match[2], 10);
    }

    const tempMatch = text.match(/fever\s*(\d{2,3}(\.\d)?)|temp(erature)?\s*(\d{2,3}(\.\d)?)/);
    if (tempMatch) {
      result.vitals!.temperature = parseFloat(tempMatch[1] || tempMatch[4]);
    }

    return result;
  }
}
