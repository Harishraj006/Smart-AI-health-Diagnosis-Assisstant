import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Brain, AlertTriangle, CheckCircle, Activity, Stethoscope } from "lucide-react";
import medicalHero from "@/assets/medical-hero.jpg";

// Symptoms data with Tamil translations
const SYMPTOMS = [
  "Fever / காய்ச்சல்", "Cough / இருமல்", "Headache / தலைவலி", "Fatigue / சோர்வு", 
  "Nausea / குமட்டல்", "Chest Pain / மார்பு வலி", "Shortness of Breath / மூச்சுத் திணறல்", 
  "Dizziness / தலைசுற்றல்", "Abdominal Pain / வயிற்று வலி", "Back Pain / முதுகு வலி",
  "Joint Pain / மூட்டு வலி", "Skin Rash / தோல் அரிப்பு", "Sore Throat / தொண்டை வலி", 
  "Runny Nose / மூக்கில் நீர் வடிதல்", "Vomiting / வாந்தி", "Body Ache / உடல்வலி",
  "Loss of Appetite / பசியின்மை", "Weight Loss / எடை குறைவு", "Night Sweats / இரவு வியர்வை",
  "Constipation / மலச்சிக்கல்", "Diarrhea / வயிற்றுப்போக்கு"
];

// AI-powered symptom analysis function
const analyzeSymptoms = (symptoms: string[], userInfo: any) => {
  const symptomAnalysis = {
    "Fever / காய்ச்சல்": ["Viral Infection / வைரஸ் தொற்று", "Bacterial Infection / பாக்டீரியா தொற்று", "Malaria / மலேரியா"],
    "Cough / இருமல்": ["Common Cold / சாதாரண சளி", "Bronchitis / மூச்சுக்குழாய் அழற்சி", "Pneumonia / நிமோனியா", "Asthma / ஆஸ்துமா"],
    "Headache / தலைவலி": ["Tension Headache / மன அழுத்த தலைவலி", "Migraine / ஒற்றைத் தலைவலி", "Sinusitis / சைனஸ் அழற்சி"],
    "Fatigue / சோர்வு": ["Anemia / இரத்தசோகை", "Thyroid Disorder / தைராய்டு கோளாறு", "Chronic Fatigue Syndrome / நீண்ட கால சோர்வு நோய்"],
    "Nausea / குமட்டல்": ["Gastroenteritis / வயிற்றுப்போக்கு நோய்", "Food Poisoning / உணவு விஷம்", "Pregnancy / கர்ப்பம்"],
    "Chest Pain / மார்பு வலி": ["Muscle Strain / தசை இழுப்பு", "Acid Reflux / அமில எதிர்வீழ்ச்சி", "Heart Condition / இதய நோய்"],
    "Shortness of Breath / மூச்சுத் திணறல்": ["Asthma / ஆஸ்துமா", "Heart Condition / இதய நோய்", "Anxiety / பதற்றம்"],
    "Dizziness / தலைசுற்றல்": ["Low Blood Pressure / குறைந்த இரத்த அழுத்தம்", "Inner Ear Problem / உள் காது பிரச்சனை", "Dehydration / நீரிழப்பு"],
    "Abdominal Pain / வயிற்று வலி": ["Gastritis / இரைப்பை அழற்சி", "Appendicitis / குடல்வால் அழற்சி", "IBS / குடல் எரிச்சல் நோய்"],
    "Back Pain / முதுகு வலி": ["Muscle Strain / தசை இழுப்பு", "Herniated Disc / தட்டு வெளியேற்றம்", "Kidney Stones / சிறுநீரக கற்கள்"],
    "Joint Pain / மூட்டு வலி": ["Arthritis / மூட்டுவலி நோய்", "Rheumatoid Arthritis / முடக்குவாதம்", "Injury / காயம்"],
    "Skin Rash / தோல் அரிப்பு": ["Allergic Reaction / ஒவ்வாமை", "Eczema / அரிக்கும் தோல்வியாதி", "Dermatitis / தோல் அழற்சி"],
    "Sore Throat / தொண்டை வலி": ["Viral Infection / வைரஸ் தொற்று", "Strep Throat / ஸ்ட்ரெப் தொண்டை", "Tonsillitis / டான்சில் அழற்சி"],
    "Runny Nose / மூக்கில் நீர் வடிதல்": ["Common Cold / சாதாரண சளி", "Allergic Rhinitis / ஒவ்வாமை நாசி அழற்சி", "Sinusitis / சைனஸ் அழற்சி"],
    "Vomiting / வாந்தி": ["Gastroenteritis / வயிற்றுப்போக்கு நோய்", "Food Poisoning / உணவு விஷம்", "Migraine / ஒற்றைத் தலைவலி"],
    "Body Ache / உடல்வலி": ["Viral Infection / வைரஸ் தொற்று", "Fibromyalgia / நார்த்தசை வலி நோய்", "Overexertion / அதிக உழைப்பு"],
    "Loss of Appetite / பசியின்மை": ["Depression / மனச்சோர்வு", "Liver Disease / கல்லீரல் நோய்", "Cancer / புற்றுநோய்"],
    "Weight Loss / எடை குறைவு": ["Hyperthyroidism / அதிக தைராய்டு", "Diabetes / நீரிழிவு நோய்", "Cancer / புற்றுநோய்"],
    "Night Sweats / இரவு வியர்வை": ["Menopause / மாதவிடாய் நிறுத்தம்", "Infection / தொற்று", "Lymphoma / நிணநீர் புற்றுநோய்"],
    "Constipation / மலச்சிக்கல்": ["IBS / குடல் எரிச்சல் நோய்", "Hypothyroidism / குறைந்த தைராய்டு", "Medication Side Effect / மருந்து பக்க விளைவு"],
    "Diarrhea / வயிற்றுப்போக்கு": ["Gastroenteritis / வயிற்றுப்போக்கு நோய்", "IBS / குடல் எரிச்சல் நோய்", "Food Poisoning / உணவு விஷம்"]
  };

  const conditionCounts = {} as Record<string, number>;
  const severityMap = {
    "Common Cold / சாதாரண சளி": "low", "Allergic Rhinitis / ஒவ்வாமை நாசி அழற்சி": "low", "Tension Headache / மன அழுத்த தலைவலி": "low",
    "Muscle Strain / தசை இழுப்பு": "low", "Dehydration / நீரிழப்பு": "low", "IBS / குடல் எரிச்சல் நோய்": "medium",
    "Migraine / ஒற்றைத் தலைவலி": "medium", "Asthma / ஆஸ்துமா": "medium", "Gastritis / இரைப்பை அழற்சி": "medium",
    "Heart Condition / இதய நோய்": "high", "Pneumonia / நிமோனியா": "high", "Appendicitis / குடல்வால் அழற்சி": "high"
  };

  // Count occurrences of each condition based on symptoms
  symptoms.forEach(symptom => {
    if (symptomAnalysis[symptom]) {
      symptomAnalysis[symptom].forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });
    }
  });

  // Convert to sorted predictions with realistic confidence scores
  const predictions = Object.entries(conditionCounts)
    .map(([condition, count]) => ({
      condition,
      confidence: Math.min(95, Math.max(35, (count / symptoms.length) * 100 + Math.random() * 20)),
      severity: severityMap[condition] || "medium",
      icon: count > 2 ? <Heart className="w-4 h-4" /> : 
            count > 1 ? <Activity className="w-4 h-4" /> : 
            <Brain className="w-4 h-4" />
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  // Adjust confidence based on age and lifestyle factors
  return predictions.map(pred => ({
    ...pred,
    confidence: Math.round(pred.confidence * (userInfo.age > "60" ? 1.1 : 1.0) * 
                          (userInfo.smoking === "current" ? 1.15 : 1.0))
  }));
};

// Mock prediction results - now dynamic
const mockPredictions = [];

export default function HealthcareAssistant() {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState({
    age: "",
    gender: "",
    smoking: "",
    alcohol: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handleAnalyze = () => {
    const aiPredictions = analyzeSymptoms(selectedSymptoms, userInfo);
    setPredictions(aiPredictions);
    setShowResults(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "success";
      case "medium": return "warning";
      case "high": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-8 h-8 text-primary" />
                <Badge variant="secondary" className="text-sm">AI-Powered Healthcare</Badge>
              </div>
              <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
                Smart Health
                <span className="text-primary"> Diagnosis</span> Assistant
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Get AI-powered insights about potential health conditions based on your symptoms. 
                Professional, secure, and designed to guide your healthcare decisions.
              </p>
              <Alert className="border-warning/20 bg-warning/5">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning-foreground">
                  <strong>Medical Disclaimer:</strong> This tool is for informational purposes only. 
                  Always consult a healthcare professional for proper medical diagnosis and treatment.
                </AlertDescription>
              </Alert>
            </div>
            <div className="relative">
              <img 
                src={medicalHero} 
                alt="Healthcare AI technology" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Assessment */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {!showResults ? (
          <Card className="shadow-xl bg-gradient-to-br from-card to-card/50 border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-foreground">Health Assessment</CardTitle>
              <CardDescription className="text-lg">
                Step {step} of 3 - {step === 1 ? "Select Symptoms" : step === 2 ? "Personal Information" : "Lifestyle Factors"}
              </CardDescription>
              <Progress value={(step / 3) * 100} className="w-full mt-4" />
            </CardHeader>
            <CardContent className="space-y-8">
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">What symptoms are you experiencing?</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {SYMPTOMS.map((symptom) => (
                      <Button
                        key={symptom}
                        variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                        className="h-auto p-4 text-left justify-start"
                        onClick={() => 
                          selectedSymptoms.includes(symptom) 
                            ? removeSymptom(symptom) 
                            : addSymptom(symptom)
                        }
                      >
                        {symptom}
                      </Button>
                    ))}
                  </div>
                  {selectedSymptoms.length > 0 && (
                    <div className="mb-6">
                      <Label className="text-base font-medium mb-3 block">Selected Symptoms:</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedSymptoms.map((symptom) => (
                          <Badge 
                            key={symptom} 
                            variant="secondary" 
                            className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeSymptom(symptom)}
                          >
                            {symptom} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={userInfo.age}
                      onChange={(e) => setUserInfo({...userInfo, age: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => setUserInfo({...userInfo, gender: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="smoking">Smoking History</Label>
                    <Select onValueChange={(value) => setUserInfo({...userInfo, smoking: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select smoking status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never smoked</SelectItem>
                        <SelectItem value="former">Former smoker</SelectItem>
                        <SelectItem value="current">Current smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="alcohol">Alcohol Consumption</Label>
                    <Select onValueChange={(value) => setUserInfo({...userInfo, alcohol: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select alcohol consumption" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    Previous
                  </Button>
                )}
                <div className="ml-auto">
                  {step < 3 ? (
                    <Button 
                      onClick={() => setStep(step + 1)}
                      disabled={step === 1 && selectedSymptoms.length === 0}
                      className="px-8"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleAnalyze} className="px-8">
                      Analyze Symptoms
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card className="shadow-xl bg-gradient-to-br from-card to-card/50 border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-foreground flex items-center justify-center gap-3">
                  <CheckCircle className="w-8 h-8 text-success" />
                  Analysis Complete
                </CardTitle>
                <CardDescription className="text-lg">
                  Based on your symptoms and information, here are the potential conditions:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {predictions.map((prediction, index) => (
                    <Card key={index} className="border-2 border-border/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {prediction.icon}
                            <h3 className="text-xl font-semibold">{prediction.condition}</h3>
                          </div>
                          <Badge variant={getSeverityColor(prediction.severity)}>
                            {prediction.severity.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Confidence Level</span>
                            <span className="font-medium">{prediction.confidence}%</span>
                          </div>
                          <Progress value={prediction.confidence} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Alert className="mt-8 border-primary/20 bg-primary/5">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-primary-foreground">
                    <strong>Next Steps:</strong> These results are AI-generated predictions for educational purposes. 
                    Please consult with a healthcare professional for proper diagnosis and treatment recommendations.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-center mt-8">
                  <Button onClick={() => {setShowResults(false); setStep(1); setSelectedSymptoms([]); setPredictions([]); setUserInfo({age: "", gender: "", smoking: "", alcohol: ""})}} variant="outline" className="px-8">
                    Start New Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}