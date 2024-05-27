import React, {useState, useRef, Fragment} from "react";
import { Link, useNavigate } from "react-router-dom";

var SessionID = "AtnQGSp1cFaYxT1X",
      uri = 'https://api.endlessmedical.com/v1/dx/';

const Session = {
    SessionID: null,
    URI: "https://api.endlessmedical.com/v1/dx/",
    form: null,
    div: null,
    error: function(e){
        alert(e);
    },
    logged: function(){},
}

const Response = async function(response){
    if(response.status >= 300)
        return {status: 'error', error: 'server error'};
    
    const data = await response.json();
    //console.log(data)
    data.status = response.status == 200 ? 'ok' : 'error';
    return data;
}

const startLogg = async function(){
    var {URI : uri, SessionID : sessionID} = Session,
          apiData = {};
    
    var response = await Response(await fetch(uri+'InitSession', {
        method: 'GET'
    }))
    //console.log(response)
    if(response.status != 'ok' || typeof response.SessionID != 'string' || !response.SessionID)
        throw response.error;
    
    Session.SessionID = response.SessionID;
    Session.logged(true);
    console.log(Session.SessionID);
    AcceptTermsOfUse();
}

const AcceptTermsOfUse = async function(){
    const {URI : uri, SessionID : sessionID} = Session;
    
    let response = await Response(await fetch(`${uri}AcceptTermsOfUse?SessionID=${sessionID}&passphrase=I have read, understood and I accept and agree to comply with the Terms of Use of EndlessMedicalAPI and Endless Medical services. The Terms of Use are available on endlessmedical.com`, {
        method: 'POST'
    }))
    
    if(response.status != 'ok')
        return ErrorHandle(response.error);
    
    GetUseDefaultValues();
}

const ErrorHandle = function(error){
    if(typeof error == 'string'){
        error = error.trim();
        
        if(error == "Couldn't find SessionID.")
            return startLogg();
        
        if(error == "Terms Of Use has to be accepted.")
            return AcceptTermsOfUse();
    }
    
    Session.error(error || "error generated, unknown");
}

const UpdateFeature = async function(name, value, cb){
    const {URI : uri, SessionID : sessionID} = Session;
    
    let response = await Response(await fetch(`${uri}UpdateFeature?SessionID=${sessionID}&name=${name}&value=${value}`,{
        method: 'POST'
    }));
    
    if(response.status != 'ok'){
        if(cb)
            cb();
        
        return ErrorHandle(response.error);
    }
    
    if(cb)
        cb(true)
}

const DeleteFeature = async function(name, cb){
    const {URI : uri, SessionID : sessionID} = Session;
    
    let response = await Response(await fetch(`${uri}DeleteFeature?SessionID=${sessionID}&name=${name}`,{
        method: 'POST'
    }));
    
    if(response.status != 'ok'){
        if(cb)
            cb();
        
        return ErrorHandle(response.error);
    }
    
    if(cb)
        cb(true)
}

const GetFeatures = async function(cb){
    if(typeof value != 'boolean')
        throw Error('A Boolean was expected');
    
    const {URI : uri, SessionID : sessionID} = Session;
    
    let response = await Response(await fetch(`${uri}GetFeatures`));
    
    if(response.status != 'ok'){
        if(cb)
            cb();
        
        return ErrorHandle(response.error);
    }
    
    if(cb)
        cb(response.data);
}

const GetUseDefaultValues = async function(cb){
    const {URI : uri, SessionID : sessionID} = Session;
    
    let response = await Response(await fetch(`${uri}GetUseDefaultValues?SessionID=${sessionID}`));
    
    if(response.status != 'ok'){
        if(cb)
            cb();
        
        return ErrorHandle(response.error);
    }
    
    if(response.value != true)
        return SetUseDefaultValues(true, cb);
    
    if(cb)
        cb(true);
}

const SetUseDefaultValues = async function(value, cb){
    if(typeof value != 'boolean')
        throw Error('A Boolean was expected');
    
    const {URI : uri, SessionID : sessionID} = Session;
    
    let response = await Response(await fetch(`${uri}SetUseDefaultValues?SessionID=${sessionID}&value=${value}`, {
        method: 'POST'
    }));
    
    if(response.status != 'ok'){
        if(cb)
            cb();
        
        return ErrorHandle(response.error);
    }
    
    if(cb)
        cb(true);
}

const GetSuggestedTests = async function(){
    const {URI : uri, SessionID : sessionID} = Session;
    
    let response = await Response(await fetch(`${uri}GetSuggestedTests?SessionID=${sessionID}&TopDiseasesToTake=20`));
    
    if(response.status != 200)
        return ErrorHandle(response.error);
    
    const {Tests} = response;
}

const GetSuggestedSpecializations = async function(){
    const {URI : uri, SessionID : sessionID} = Session;
    
    let response = await Response(await fetch(`${uri}GetSuggestedSpecializations?SessionID=${sessionID}&&NumberOfResults=20`));
    
    if(response.status != 200)
        return ErrorHandle(response.error);
    
    const {SuggestedSpecializations} = response;
}

const GetSuggestedFeatures_PatientProvided = async function(){
    const {URI : uri, SessionID : sessionID} = Session;
    
    let response = await Response(await fetch(`${uri}GetSuggestedFeatures_PatientProvided?SessionID=${sessionID}&&TopDiseasesToTake=20`));
    
    if(response.status != 200)
        return ErrorHandle(response.error);
    
    const {SuggestedFeaturesPA} = response;
}

const GetSuggestedFeatures_PhysicianProvided = async function(){
    const {URI : uri, SessionID : sessionID} = Session;
    
    let response = await Response(await fetch(`${uri}GetSuggestedFeatures_PhysicianProvided?SessionID=${sessionID}&&TopDiseasesToTake=20`));
    
    if(response.status != 200)
        return ErrorHandle(response.error);
    
    const {SuggestedFeaturesPH} = response;
}

const DIAnalyze = async function(cb){
    const {URI : uri, SessionID : sessionID} = Session;
    
    let response = await Response(await fetch(`${uri}Analyze?SessionID=${sessionID}&&NumberOfResults=20&ResponseFormat=application/json`));
    
    if(response.status != 'ok'){
        if(cb)
            cb();
        
        return ErrorHandle(response.error);
    }
    
    response.status = 'diagnose success';
    if(cb)
        cb(response);
}

const testUser = async function(){
    const {URI : uri, SessionID : sessionID} = Session;
    //console.log(uri, sessionID)
    let response = await Response(await fetch(`${uri}GetUseDefaultValues?SessionID=${sessionID}`,{
        method: 'GET'
    }));
    //console.log(response);
    if(response.status != 'ok')
        startLogg();
    else
        Session.logged(true);
    
    return setTimeout(testUser, 10000);
}

const FeaturesData = [
    "Age",
    "BMI",
    "Temp",
    "HeartRate",
    "SBP",
    "DBP",
    "EdemaRos",
    "ElevatedSystolicBp",
    "ElevatedDiastolicBp",
    "VeryElevatedSystolicBp",
    "VeryElevatedDiastolicBp",
    "RR",
    "O2Sats",
    "Fio2",
    "WeightLoss",
    "WeightGain",
    "Chills",
    "HistoryFever",
    "GeneralizedFatigue",
    "DecreasedMood",
    "Ambulation",
    "NHLongTermResidency",
    "Fasting",
    "RecentHospitalStay",
    "Contacts",
    "Arrest",
    "HypoTension",
    "IndwellingCatheters",
    "MalariaTravel",
    "NewDetergents",
    "NewFoods",
    "GoutFoods",
    "VisualAcuityRos",
    "BlindnessRos",
    "DoubleVisionRos",
    "YellowScleraeRos",
    "EyesItchy",
    "Sneezing",
    "LossOfSmell",
    "LossOfTaste",
    "PostNasalDrainage",
    "RunnyNoseCongestion",
    "EasyBleedingFromGums",
    "SinusesPainRos",
    "Seasonal",
    "NotSoSeasonal",
    "Hoarseness",
    "Angioedema",
    "LarynxPain",
    "SoreThroatROS",
    "Trismus",
    "AphtousUlcers",
    "GlossitisOnROS",
    "PainBehindJawAngle",
    "EarPainRos",
    "DryMucusMembranes",
    "DryEyes",
    "HearingLossRos",
    "EarDCRos",
    "OrthopneaHx",
    "ParoxysmalNDHx",
    "ChestPainAnginaYesNo",
    "ChestPainSeverity",
    "ChestPainAginaStabilitySeverity",
    "ChestPainAginaStabilityFrequency",
    "ChestPainAginaStabilityLast",
    "ChestPainQuality",
    "ChestPainLasts",
    "ChestPainRadiation",
    "ChestPainAginaLocalized",
    "ChestPainReproducibleByPalpation",
    "ChestPainAssociatedWithCough",
    "ChestPainAginaNitro",
    "ChestPainAginaAntacid",
    "ChestPainAginaRest",
    "Arrhythmia",
    "ArrhythmiaSymptomsLightheadedness",
    "ArrhythmiaSymptomsChestPains",
    "ArrhythmiaSymptomsWeakness",
    "ArrhythmiaSymptomsHeadaches",
    "ArrhythmiaSymptomsSweats",
    "DVTSx",
    "DyspneaSeveritySubjective",
    "DyspneaProgressionSubjective",
    "DyspneaAnxiety",
    "DyspneaTingling",
    "DyspneaLightheadedness",
    "DyspneaBag",
    "MucousProduction",
    "MucousProductionInc",
    "MucusFeatures",
    "MucousCharacter",
    "SeverityCough",
    "WheezingH",
    "WheezingEpisodic",
    "HemoptysisTiming",
    "ChestPainPleuriticPulm",
    "ChestPainProgressionPulm",
    "Snoring",
    "DayTimeSleepiness",
    "SkinMoistureHx",
    "EasyBruising",
    "SkinSweatingHx",
    "JaundiceHx",
    "HyperpigmentationSkinHx",
    "HirsutismHx",
    "SkinErythemamaculesRashHx",
    "SkinErythemaNodosum",
    "SkinErythemapapulesRashHx",
    "SkinErythemapustulesRashHx",
    "SkinPetechiaeRashHx",
    "SkinUrticariaRashHx",
    "SkinFlushes",
    "SkinHerpesRashHx",
    "SkinItchinessHx",
    "PerineumItchinessHx",
    "PerianalItchinessHx",
    "FingersClubbing",
    "BreastGynecomastia",
    "Erythema",
    "SpiderAngioma",
    "Nausea",
    "Vomiting",
    "DryRetching",
    "HeartBurn",
    "UpperGIBleedSx",
    "LowerGIBleedSx",
    "DiarrheaSx",
    "FattyStool",
    "ChronicDiarrheaSx",
    "Constipation",
    "Stool",
    "StoolEvac",
    "VagueAbdSx",
    "AbdDiscomfortExacerbatedByStress",
    "AbdCramps",
    "FlatulenceAbdSx",
    "StomachPainSeveritySx",
    "StomachPainDistributionSx",
    "StomachPainResolvesPRDXSx",
    "PeriAnalPainSx",
    "PeriAnalSoilingSx",
    "StomachPainProgressionSubjective",
    "StomachPainLength",
    "StomachPainDuration",
    "RUQPain",
    "LUQPain",
    "RLQPain",
    "LLQPain",
    "RLFlankPain",
    "StomachPainPeriumbilicalArea",
    "StomachPainEpigastricArea",
    "RLInguinalPain",
    "BellowTheUmbAbdPain",
    "StomachPainPeriod",
    "AbdPainRadBack",
    "AbdPainImprovesLeaning",
    "AbdPainRadPerineum",
    "BackPainRadPerineum",
    "FastingPain",
    "EtohAbdPain",
    "EatingPain",
    "LayingdownPain",
    "StrainingPain",
    "FoodIntake",
    "Malnutrition",
    "EarlySatiety",
    "FluidIntake",
    "FluidNoLytesIntake",
    "SwallowPain",
    "SolidsSwallow",
    "FluidsSwallow",
    "ChokingSwallow",
    "RegurgFood",
    "FecalUrgency",
    "UrineSoilingSx",
    "BurningWithUrination",
    "UrinaryFrequency",
    "GrossHematuria",
    "DarkUrine",
    "FoamyUrine",
    "MicroscopicHematuriaRBCs",
    "UAProteinuria",
    "MicroscopicHematuriaOccult",
    "Nocturia",
    "UrinationRelieves",
    "WeakStream",
    "StrainStream",
    "UrinaryUrgency",
    "LessUrine",
    "Oliguria",
    "Polyuria",
    "Polydipsia",
    "StressIncoHx",
    "NonEmptyBladder",
    "UrgencyIncoHx",
    "ConstantIncoHx",
    "FemaleSpottingSx",
    "FemaleVaginalDryness",
    "MaleSpottingSx",
    "FemaleDCSx",
    "MaleDCSx",
    "VaginalSorenessSx",
    "VaginalItching",
    "PusMaleSpottingSx",
    "ScrotalPainSx",
    "HeavyPeriodsSx",
    "HematuriaAroundPeriod",
    "IrregularPeriodsSx",
    "LastPeriod",
    "DyspaureniaSx",
    "MaleProstatePainSx",
    "HxChildbirth",
    "AnyLocalNeuroFindings",
    "RestlessLegsSymptomsROS",
    "LocalizedSensoryDeficitHx",
    "LocalizedNeuroMotoLEHx",
    "LocalizedNeuroSensUEHx",
    "LocalizedNeuroSensLEHx",
    "LocalizedNeuroMotoUEHx",
    "GeneralizedWeakness",
    "AMS",
    "DecreasedLongTermMemory",
    "DecreasedLongTermMemoryOnExam",
    "DecreasedShortTermMemoryOnExam",
    "DecreasedShortTermMemory",
    "Seizure",
    "AphasiaHx",
    "AphasiaHxSensory",
    "LossOfConsciousness",
    "LossOfConsciousnessProdrome",
    "LossOfConsciousnessProdromePalpitations",
    "LossOfConsciousnessProdromeChestPain",
    "LossOfConsciousnessHeadache",
    "LossOfConsciousnessSeizures",
    "LossOfConsciousnessSphincter",
    "LossOfConsciousnessPostictall",
    "OrthostaticLightheadedness",
    "DizzinessWithPosition",
    "DizzinessWithExertion",
    "HeadacheFrontal",
    "HeadacheAssociatedWithHTN",
    "HeadacheAssociatedWithStress",
    "HeadacheAssociatedWithDecreasedCaffeineIntake",
    "HeadacheThunderclap",
    "HeadacheTemporal",
    "HeadacheOther",
    "HeadacheIntensity",
    "Photophobia",
    "Phonophobia",
    "HeadachePulsatile",
    "HeadacheSqueezing",
    "TearingOfEye",
    "HeadacheTiming",
    "HeadacheAssociatedWithNausea",
    "HeadacheAssociatedWithPhysicalActivity",
    "HeatIntolerance",
    "ColdIntolerance",
    "SaltCraving",
    "Pica",
    "HallucinationsROS",
    "NeckStiffn",
    "LowbackPain",
    "LowbackSeverity",
    "LowbackPainFlexion",
    "LowbackPainTrig",
    "LowbackPainSleep",
    "LowbackPainExercise",
    "BoneLocPain",
    "JointsPain",
    "BoneGenPain",
    "MuscleGenPain",
    "GoutyRosPain",
    "GoutyRosPainProgression",
    "SpinePain",
    "RestingPainInLowerExtremities",
    "TraumaToToesWithNoSkinBrake",
    "HeightDecreased",
    "PMHXChestTrauma",
    "PMHXMarfanSyndrom",
    "PMHXHeadTrauma",
    "PMHXCOPD",
    "PMHXAsthma",
    "PMHXAtopicDermatitis",
    "PMHXBPInf",
    "PMHXRiskFxDVT",
    "PMHXSpontanousAbortion",
    "PMHXofDVTorPE",
    "PMHXofSVT",
    "PMHXCHF",
    "PMHXCAD",
    "PMHXOfThoracicAorticAneurysmOrDissection",
    "PMHXPVD",
    "PMHXCVA",
    "PMHXICH",
    "ThyroidBruit",
    "PMHXAFib",
    "PMHXHTN",
    "ResistantHypertension",
    "EarlyOnsetOfHypertension",
    "AbruptOnsetOfHypertension",
    "LateOnsetOfHypertension",
    "PMHXDM1",
    "PMHXDM2",
    "PMHXHyperlipidemia",
    "PMHXPCDM",
    "PMHXKidneyStone",
    "PMHXPUD",
    "PMHXERCP",
    "PMHXAbdominalSurgery",
    "PMHXBowelObstruction",
    "PMHXRecentAngiography",
    "PMHXVeneral",
    "PMHXHIV",
    "PMHXHypo",
    "PMHXCKD",
    "PMHXGout",
    "PMHXBPH",
    "PMHXBladderCancer",
    "PMHXProstateCancer",
    "PMHXOvarianC",
    "PMHXChrons",
    "PMHXCU",
    "PMHXPancreatitis",
    "PMHXColonPolyp",
    "PMHXAbdominalRadiation",
    "PMHXAbdominalHernia",
    "PMHXAtypicalDuctalorLobularHyperplasiaOrLobularCarcinomaOnPriorBreastBiopsy",
    "PMHXBRCA12positivity",
    "AgeAtMenarche",
    "AgeAtMenopause",
    "AgeAtFirstBirth",
    "PMHXGE",
    "PMHXLiverCirrhosis",
    "PMHXVarices",
    "PMHXPeritionitis",
    "PMHXVGallStones",
    "PMHXDiverticulosisDiverticulitis",
    "PMHXDiverticulosisDiverticulosis",
    "PMHXColonCancer",
    "PMHXDepression",
    "PMHXSubstanceAbuse",
    "PMHXPsychOtherThanDepresion",
    "PMHXAspiration",
    "PMHXPneumonia",
    "PMHXURTI",
    "PMHXTonsillectomy",
    "PMHXDentalWork",
    "PMHXID",
    "PMHXAutoimmune",
    "PMHXMalNeo",
    "PMHXContactHospital",
    "PMHXContactDialysis",
    "PMHXContactWoundCare",
    "PMHXContactNursingHome",
    "PMHXWoundCurrent",
    "PMHXDialysisCurrent",
    "PMHXHepatitisC",
    "PMHXHepatitisB",
    "Anticoag",
    "CurrentUseOfHormonalReplacementTherapy",
    "BronchoDilators",
    "Diuretics",
    "DiureticsRecentlyStartedOrIncreased",
    "PatientOnDiuretics",
    "DiureticsOvert",
    "AllergicToDye",
    "WoundCareRecent",
    "PoAbxMed",
    "OpiatesMed",
    "IVAbxMed",
    "ACEARB",
    "ACEARBUseCausedAzotemia",
    "NSAIDSMed",
    "ContrastIodine",
    "TCAMed",
    "AntiCholinergicMed",
    "SerotoninergicMed",
    "BZDMed",
    "LithiumMed",
    "ThisSeasonsFluVaccineGiven",
    "CovidVaccineTaken",
    "AllergyMeds",
    "NeutropeniaMeds",
    "PancreatitisMeds",
    "NitratesMeds",
    "NitratesMedsRelatedToHeadaches",
    "MedsRecentChemotherapy",
    "HistoryOfChestRadiation",
    "FHCOPD",
    "FHAsthma",
    "FHAtopicDermatitis",
    "FHCAD",
    "FHHTN",
    "FHDM",
    "FHDVTPEParent",
    "FHIBDCD",
    "FHIBDCU",
    "FHMEN2",
    "FHProstateCa",
    "FHBreastCancer",
    "FHVHL",
    "FHNF1",
    "FHEarlyCC",
    "ExposurePneumonitis",
    "ExposureBladderCancer",
    "Smoker",
    "ETOH",
    "RecentIVDrugs",
    "RecentCocaineUse",
    "DustExposure",
    "TBExposure",
    "SexExposure",
    "SexActive",
    "PregnancyPossible",
    "UrinePregnancyTest",
    "ExposureToCovid",
    "Gender",
    "Race",
    "Anisocoria",
    "Pupils",
    "PupilsReaction",
    "Conjunctivas",
    "ConjunctivasPale",
    "Exophtalmos",
    "Acuity",
    "Blindness",
    "NoseCongestion",
    "SinusesTender",
    "ThroatExam",
    "DentalHygiene",
    "DryMMExam",
    "GlossitisOnExam",
    "HistoryOfHavingWetEar",
    "HistoryOfEarTraumaPriorToPain",
    "OtoscopicSerous",
    "OtoscopicPus",
    "DischargeFromEar",
    "MeatusTender",
    "MeatusEdematous",
    "MeatusErythematous",
    "OtoscopicErythema",
    "OtoscopicBulding",
    "NeckStiffness",
    "NeckSwollen",
    "ThyroidEnlarged",
    "ThyroidNodules",
    "AnteriorCervicalNodesExam",
    "Rales",
    "Rhonchi",
    "Wheezing",
    "DecreasedBreathSounds",
    "AccessoryMuscles",
    "ProlongedExpPhase",
    "RhythmRegular",
    "JVD",
    "OrthopneaExam",
    "EarlySystolicHolosystolicMurmurAtApexMR",
    "EarlySystolicHolosystolicMurmurAtApexRadiationMR",
    "EarlySystolicHolosystolicMurmurLeftSternalBorderTR",
    "EarlySystolicHolosystolicMurmurLeftSternalBorderRadiationTR",
    "EarlySystolicHolosystolicMurmurAtTheLeftLowerSternalBorderVSD",
    "EarlySystolicHolosystolicMurmurAtTheLeftLowerSternalRadiationVSD",
    "MidSystolicEjectionMurmurAtTheRightSternalBorderAS",
    "MidSystolicEjectionMurmurAtTheRightSternalBorderRadiationAS",
    "EarlyDiastolicMurmurAR",
    "EarlyDiastolicMurmurRadiationAR",
    "GrahamSteell",
    "PDAM",
    "PericardialFriction",
    "RS3Tone",
    "RS4Tone",
    "LS3Tone",
    "LS4Tone",
    "AsymmetricEdemaLE",
    "Edema",
    "TenderLE",
    "DVTSg",
    "LegsWarm",
    "LegsRed",
    "DistalPulsesLE",
    "ColdLowerLimbTips",
    "ClaudicationLowerExtremities",
    "ColdUpperLimbTips",
    "FemoralPulses",
    "BloodPressureDifference",
    "BloodPressureDifferenceLR",
    "PulseStrenghtDifferenceLR",
    "CarotidBruits",
    "RenalBruits",
    "EpigastricTender",
    "LowerMidAbdTender",
    "PeriumbilicaAbdTender",
    "RUQTender",
    "LUQTender",
    "RLLQTender",
    "ReboundTenderness",
    "AbdGuarding",
    "AbdAscites",
    "CaputMedusae",
    "MurphysSign",
    "BowelSounds",
    "PsoasSign",
    "RovsingSign",
    "CullenSign",
    "MalnutritionByExam",
    "GreyTurnersign",
    "BladderFull",
    "BladderEmpty",
    "RLInguinalAreaTender",
    "RLInguinalAreaCoughBulge",
    "InguinalLymphadenopathy",
    "AxillaryLymphadenopathy",
    "RectalExamHemorrhoids",
    "RectalExamRectalCancer",
    "RectalExamFissure",
    "RectalExamBlood",
    "HepatomegalyEx",
    "SplenomegalyEx",
    "IrregularLiverEx",
    "TestisTenderPE",
    "TestisEnlarged",
    "TestisIrregular",
    "GoldflamsSign",
    "RectalExamProstateTEnder",
    "RectalExamProstateEnlarged",
    "RectalExamProstateHardened",
    "RectalExamProstateIrregular",
    "PresenceOfPunctateHaemorrhagesOnVaginalExam",
    "PresenceOfThinAndDryMucosa",
    "PresenceOfVulvarInflamation",
    "Cyanosis",
    "SubcutaneousFatNecrosis",
    "Panniculitis",
    "SignsOfInfectionAtExitSitesOfCatheters",
    "SkinMoistureExam",
    "Jaundice",
    "SkinPetechiaeRashExam",
    "SkinExfoliativeRashExam",
    "SkinIschemicChanges",
    "SkinUrticariaRashExam",
    "CondylomataExam",
    "SkinHerpesRashExam",
    "SkinErythemamaculesRasExam",
    "SkinErythemaNodosumExam",
    "SkinErythemapapulesRashExam",
    "SkinErythemapustulesRashExam",
    "SkinFlushingExam",
    "AtaxiaLE",
    "AtaxiaUE",
    "Myoclonus",
    "Dysarthria",
    "Tremor",
    "PickingObjects",
    "MuscleRigidity",
    "LocalizedNeuroSensLEEx",
    "LocalizedNeuroMotoLEEx",
    "LocalizedNeuroSensUEEx",
    "LocalizedNeuroMotoUEEx",
    "LocalizedSensoryDeficitEx",
    "LocalizedMotorDeficitEx",
    "GeneralizedWeaknessExam",
    "AphasiaExam",
    "MeningealSigns",
    "RombergsSign",
    "BabinskiSign",
    "FeetClonus",
    "GeneralHyperreflexia",
    "StraightLegRaise",
    "CrossedStraightLegRaise",
    "WeakAnkle",
    "WeakKnee",
    "NystagmusEyeMovements",
    "GoutyExamTenderness",
    "GoutyExamWarmth",
    "GoutyExamEdema",
    "LumbarLordosis",
    "ParaspinalMuscles",
    "LimitedSpine",
    "TspineTenderEx",
    "LspineTenderEx",
    "SspineTenderEx",
    "HallucinationsOnExam",
    "CspineTenderEx",
    "MSVerbalContact",
    "MSOrientation",
    "MSFullyAwakens",
    "MSDrowsiness",
    "MSStimulusAwakens",
    "MSAgitated",
    "HGBlevel",
    "DropInHGBlevelWithinLast24Hours",
    "MCVlevel",
    "WBClevel",
    "LymphocyteLevel",
    "SerumCreatinine",
    "SerumCreatinineAtBaseline",
    "BaselineeGFR",
    "PlateletsLevel",
    "INR",
    "TSAT",
    "FerritinLab",
    "FolateLab",
    "B12 Lab",
    "MMALevel",
    "HomocysteineLevel",
    "IntrinsicFactorLab",
    "antiPLA2Rab",
    "antiGBM",
    "antiTHSD7Aab",
    "HepatitisCAntibodiesTotalIgGAndIgM",
    "Albuminlevel",
    "CRPlevel",
    "ESRlevel",
    "AldoRenin",
    "TSHFeature",
    "Aldosterone",
    "Potassium",
    "DDimer",
    "TroponinI",
    "PCT",
    "LDH",
    "HaptoglobinLab",
    "UricAcidLevel",
    "AST",
    "ALT",
    "Amylase",
    "Lipase",
    "TotalBilirubin",
    "AlkalinePhosphatase",
    "SerumCK",
    "BNP",
    "PSA",
    "Bicarb",
    "Calcium",
    "TriglyceridesLevel",
    "CholesterolLevel",
    "LacticAcid",
    "AnionGap",
    "BetaHydroxyButyrate",
    "Hba1c",
    "GAD65",
    "InsulinAA",
    "TyrosinePhosphatases",
    "IsletCellAA",
    "ZincTransporterZNT8",
    "FastingGlucose",
    "TwoHrPlasmaGlucoseDuringOGTT",
    "RandomBloodGlucose",
    "Proteinuria",
    "Albuminuria",
    "FeaturesOfHematuriaOnUA",
    "SerumbHCG",
    "PelvicUSForEctopicPregnancy",
    "PelvicUSForNlPregnancy",
    "gFOBT",
    "pCO2onABG",
    "pHonABG",
    "pHofVaginalDc",
    "HypercapniaOnAbg",
    "FeaturesOfInflamationOnUA",
    "GramStainUrineGonococcus",
    "WetMountResults",
    "WhiffTestResults",
    "BuddingYeastMyceliaAfterKOH",
    "RightVentricleStrainOnEcho",
    "DecreasedEFonECHO",
    "SegmentalDyskinesiaHypokinesiaAkinesiaECHO",
    "AorticDissectionTEE",
    "StressECGCAD",
    "StressEchoCAD",
    "StressNuke",
    "OSAOnSleepStudy",
    "FEV1toFVCRatio",
    "FEV1toFVCRatioImprovingBy12BeforeAndAfterBronchodilator",
    "CxrayFocalInfiltrate",
    "CxrayPTX",
    "ChestCTPTX",
    "XrayDoubleBariumEnemaForColonCa",
    "HydroOnCT",
    "GroundGlassOnChestCt",
    "IntersitialAbnormalitiesOnChestCt",
    "LocalPatchyInfiltratesOnChestCt",
    "DiverticulitisOnCt",
    "AppendicitsOnUS",
    "AppendicitsOnCT",
    "RenalArteriesDigitalSubstractionAngiography",
    "RenalArteriesMagneticResonanceAngiographyWithGadolinum",
    "RenalArteriesMagneticResonanceAngiographyWithoutGadolinum",
    "RenalArteriesCTAngiographyWithIVDye",
    "ThoracicAortaCTAngiographyWithIVDye",
    "PEonCTAngio",
    "PEonVQScan",
    "RVStrainOnCTAngio",
    "BiliaryColicOnCt",
    "BiliaryCollicOnUS",
    "BiliaryCollicOnEUS",
    "PeriNephricStrandingOnCT",
    "LBOOnAbdominalPlainRadiograph",
    "LBOonCTwDye",
    "LBOonCT",
    "SBOOnAbdominalPlainRadiograph",
    "PneumoperitoneumAbdXray",
    "PneumoperitoneumChestXray",
    "PneumoperitoneumChestCT",
    "PneumoperitoneumAbdCT",
    "SBOonCTwDye",
    "SBOonCT",
    "SBOOnBedsideUltrasound",
    "IschemicColitisOnUltrasound",
    "AMIOnAbdominalPlainRadiograph",
    "AMIODigitalSubstractionAngiography",
    "AMIonCTAngio",
    "AMIonCT",
    "IschemicColitis",
    "XrayBariumEnemaForLBO",
    "NephrolithiasisOnCT",
    "NephrolithiasisOnUS",
    "UreterolithiasisOnCT",
    "UreterolithiasisOnUS",
    "ColonMalignancyOnCTColonography",
    "DenseBreastTissueOnMammography",
    "HydroOnUS",
    "RenalArterieDuplexUltrasonography",
    "RenalAsymmetryOnUS",
    "USProstateEnlarged",
    "ElevatedPVR",
    "ThickenedBladderWall",
    "BladderMalignancyOnUS",
    "JugularVeinFacialVeinsThrombosis",
    "ArterialLowerExtremitiesDopplers",
    "FirstExtremitiesDopplersToRuleOutDVT",
    "SecondExtremitiesDopplersToRuleOutDVT",
    "ExtremitiesDopplersToRuleOutSVT",
    "JugularVeinFacialVeinsThrombosisonCT",
    "CxrayPleuralEffusion",
    "CxrayWidenedMediastinum",
    "CxrayBlInfilEdema",
    "CxrayBilInfiltrates",
    "BrainCTNonContrastForSAH",
    "CranialCTNonContrastForChronicSinusitis",
    "CranialCTNonContrastForAcuteSinusitis",
    "ParanasalSinusesTargetedXrayForSinusitis",
    "BrainCTNormal",
    "BrainMRINormal",
    "BrainMRIWithGadNormal",
    "BrainCTContrastNormal",
    "BrainCTNonContrastForICH",
    "BrainCTNonContrastForIschemicCVA",
    "BrainMRIForIschemicCVA",
    "MembranousNephropathyOnBiopsy",
    "GoodpastureSyndromeonKidneyBiopsy",
    "NephriticSyndromeonKidneyBiopsy",
    "NephroticSyndromeonKidneyBiopsy",
    "MSUInSynovialFluid",
    "LumbarPunctionFluidForSAH",
    "TransrectalProstateBiopsy",
    "CirrhosisOnLiverBiopsy",
    "BreastBiopsy",
    "BRCA12GeneticTesting",
    "PCRCovid",
    "PCRGonococcus",
    "PCRChlamydia",
    "PCRRNAHepC",
    "PCRFlu",
    "HIV1HIV2ElisaResults",
    "PCRHIVDNA",
    "HIVWesternBlot",
    "BloodCulturesx2",
    "CdiffStoolToxin",
    "StoolForOvasAndParasites",
    "LegionellaUrinaryAntigenFeature",
    "StreptococcusUrinaryAntigenFeature",
    "ThroatCulture",
    "StoolCulture",
    "ThroatCultureForFusobacteriumNecrophorum",
    "BloodCultureForFusobacteriumNecrophorum",
    "RapiStrepTest",
    "DeviceBloodCultures",
    "RapidFluAntigenTesting",
    "LactoseHydrogenTest",
    "UreaBreathTest",
    "StoolAntigenForHPylori",
    "RapidUreaseTestEGD",
    "UConColonoscopyPathology",
    "ColonMalignancyOnColonoscopy",
    "EsophagitisOnEGD",
    "AnalFissureOnCScope",
    "AnalFissureOnCSigmoidoscopy",
    "CrohnsOnColonoscopy",
    "CrohnsOnEGD",
    "CrohnsOnMRI",
    "CrohnsOnCT",
    "GastritisOnEGD",
    "GallStonesInCysticDuctMRIMRCP",
    "AcuteCholecystitisConfirmationByUS",
    "AcuteCholecystitisConfirmationByHIDA",
    "GallStonesInPancreaticDuctCT",
    "GallStonesInPancreaticDuctMRIMRCP",
    "GallStonesInCommonBileDuctMRIMRCP",
    "GallStonesInGallBladerMRIMRCP",
    "GallStonesERCP",
    "GallStonesEUS",
    "PUDOnEGD",
    "BleedingPUDOnEGD",
    "BleedingEsophagealVarices",
    "EsophagealVaricesOnEGD",
    "EsophagealVaricesOnCT",
    "CirrhosisOnCT",
    "UrogramCT",
    "UrineCytology",
    "PollenAllergyTesting",
    "DustMitesAllergyTesting",
    "CystoscopyWithBiopsies",
    "ChronicPancreatitisOnAbdXray",
    "ChronicPancreatitisOnCt",
    "AcutePancreatitisOnAbdCT",
    "CirrhosisOnFibroScan",
    "CirrhosisOnMRI",
    "CirrhosisOnUS",
    "ProstateMalignancy",
    "BreastMalignancy",
    "ElectrocardiogramIschemicChangesNSTEMI",
    "ElectrocardiogramNonsepcificSTChanges",
    "ElectrocardiogramIschemicChangesSTEMI",
    "ElectiveCoronaryAngiogram",
    "CTCoronaryAngiogram",
    "CoronaryAngiogram",
    "RHCRv",
    "RHCLv",
    "CoronaryAngiogramAorticDissectionFound",
    "ElectrocardiogramHeartBlock",
    "ElectrocardiogramPreExcitation",
    "ElectrocardiogramHyperkalemia",
    "ElectrocardiogramHypokalemia",
    "ElectrocardiogramHypocalcemia",
    "ElectrocardiogramHypercalcemia"
  ]

testUser();

function Diagnosis(){
    /*const divref = useRef();
    const formref = useRef();*/
    
    const [errorValue, setErrorValue] = useState(''),
          [loggedClient, setLoggedValue] = useState(false),
          [divInner, setDiv] = useState(
              <ol>
                    {
                      FeaturesData.map(f => <li key={f}><span>{f}</span></li>)
                    }
              </ol>),
          [loader, setLoader] = useState({display: "none"});
    
    Session.error = setErrorValue;
    Session.logged = setLoggedValue;
    
    const selection = function(e){
        let {value} = e.target;
        Session.error(null);
        
        if(value == 'features'){
            setDiv(
                <ol>
                    {
                      FeaturesData.map(f => <li key={f}><span>{f}</span></li>)
                    }
              </ol>
            )
        }
        else if(value == '+features'){
            function submit(e){
                e.preventDefault();
                let form = e.target;
                
                let select = form.querySelectorAll('select')[0],
                    input = form.querySelector('input');
                
                if(!select || !input)
                    return Session.error('error occured');
                
                if(!FeaturesData.includes(select.value))
                    return Session.error(select.value+' is not valid');
                
                if(!input.value.length)
                    return Session.error('invalid value');
                
                if(!loggedClient)
                    return Session.error('failed to connect to the server');
                
                setLoader({display: "flex"});
                
                UpdateFeature(select.value, input.value, function(r){
                    setLoader({display: "none"});
                    Session.error(r ? 'updated successfully' : 'did not update, failed');
                })
            }
            
            const changeSelect = function(e){
                if(['text', 'number'].includes(e.target.value)){
                    let parent = e.target.parentElement.parentElement;
                    if(!parent)
                        return;
                    
                    let inp = parent.querySelector('input');
                    if(!inp)
                        return;
                    
                    inp.type = e.target.value;
                }
            }
            
            const changeInput = function(e){
                let value = e.target.value;
                
                let parent = e.target.parentElement.parentElement;
                if(!parent)
                    return;
                
                let select = parent.querySelectorAll('select')[0],
                    btn = parent.querySelector('button');
                
                if(!select || !btn)
                    return;
                
                if(value && value.length && !select.value.length)
                    btn.setAttribute('disabled', false);
                else if(btn)
                    btn.setAttribute('disabled', true);
            }
            
            setDiv(
                <form onSubmit={submit}>
                    <div className="select">
                        <select>
                            {
                                FeaturesData.map(f => <option key={f} value={f}>{f}</option>)
                                                 }
                        </select>
                    </div>
                    <div className="select">
                        <select value="text" onChange={changeSelect}>
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                        </select>
                    </div>
                    <label className="omrs-input-underlined">
                        <input type='text' onChange={changeInput} required placeholder="Feature Value" />
                        {/*<span className="omrs-input-label">feature value</span>*/}
                        <span className="omrs-input-helper">View list from the top left by chosing "view all features"</span>
                    </label>
                    <button disabled type="submit"></button>
                </form>
            )
        }
        else if(value == '-features'){
            function submit(e){
                e.preventDefault();
                let form = e.target;
                let select = form.querySelector('select');
                
                if(!select)
                    return Session.error('error occured');
                
                if(!FeaturesData.includes(select.value))
                    return Session.error(select.value+' is not valid');
                
                if(!loggedClient)
                    return Session.error('failed to connect to the server');
                
                setLoader({display: "flex"});
                
                DeleteFeature(select.value, function(r){
                    setLoader({display: "none"});
                    Session.error(r ? 'deleted successfully' : 'did not delete, failed');
                })
            }
            
            const changeSelect = function(e){
                if(!FeaturesData.includes(e.target.value))
                    e.target.value = '';
            }
            
            setDiv(
                <form onSubmit={submit}>
                    <div className="select">
                        <select onChange={changeSelect}>
                            {
                                FeaturesData.map(f => <option key={f} value={f}>{f}</option>)
                                                 }
                        </select>
                    </div>
                    <button disabled type="submit"></button>
                </form>
            )
        }
        else if(value == 'Analyze'){
            function submit(e){
                e.preventDefault();
                
                if(!loggedClient)
                    return Session.error('failed to connect to the server');
                
                setLoader({display: "flex"});
                
                DIAnalyze(function(r){
                    setLoader({display: "none"});
                    
                    if(!r)
                        Session.error("failed to analyse");
                    else
                        setDiv(
                            <Fragment>
                                <form onSubmit={submit}>
                                    <p>Analyse your data? yes by submiting</p>
                                    <button type="submit" className="Analysebtn">Analyse</button>
                                </form>
                                <div className="code">
                                    <pre>
                                        <code>
                                            <ol>
                                            {
                                                Object.keys(r).map(k=>{
                                                    let a = r[k],
                                                        isA = Array.isArray(a);
                                                    console.log(a, isA);
                                                    let d = a.length ? (isA ? a.join(', ') : a) : 'no '+k+' found';
                                                    return <li key={k}><span>{k}</span><span>{d}</span></li>
                                                })
                                            }
                                            </ol>
                                        </code>
                                    </pre>
                                </div>
                            </Fragment>
                        );
                })
            }
            
            setDiv(
                <form onSubmit={submit}>
                    <p>Analyse your data? yes by submiting</p>
                    <button type="submit" className="Analysebtn">Analyse</button>
                </form>
            )
        }
        else{
            console.log(e.target);
            alert(value+' is not supported yet');
        }
    }
    
    /*Session.div = divref;
    Session.form = formref;*/
    const json = {name: 'gift', surname: 'masimula'}
    return(
        <div className="diagnosis">
            <div className='loader' style={loader}></div>
            <nav className="nav-bar">
                <div id="navbar">
                    <ul>
                        <li>
                            <Link to="/home" className="nav-link">Home</Link>
                        </li>
                        <li>
                            <Link to="/history" className="nav-link">History</Link>
                        </li>
                        <li>
                            <Link to="/update" className="nav-link">Update</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="diagnosis-wrapper">
                <div className="error">
                    <p>{errorValue}</p>
                </div>
                <div className="select">
                    <select onChange={selection}>
                        <option value="features">show all features</option>
                        <option value="+features">add a feature</option>
                        <option value="-features">delete a feature</option>
                        <option value="Analyze">Analyse</option>
                    </select>
                </div>
                <div>
                    {
                        divInner
                    }
                </div>
            </div>
        </div>
    )
}

export default Diagnosis