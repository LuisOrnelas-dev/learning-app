import React, { memo, useCallback, useMemo } from 'react';
import { FaUser, FaTools, FaGraduationCap, FaGlobe, FaClock, FaBullseye } from 'react-icons/fa';

// Memoized form sections to prevent unnecessary re-renders
const GeneralInformation = memo(({ formData, handleChange }) => (
  <div className="border-b border-gray-200 p-6">
    <div className="flex items-center mb-4">
      <FaUser className="text-blue-600 mr-2" />
      <h2 className="text-xl font-semibold">General Information</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="e.g., John Smith"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current role
        </label>
        <select
          name="currentRole"
          value={formData.currentRole}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="">Select your role</option>
          <option value="Maintenance Technician">Maintenance Technician</option>
          <option value="Maintenance Supervisor">Maintenance Supervisor</option>
          <option value="Maintenance Planner">Maintenance Planner</option>
        </select>
      </div>
    </div>
  </div>
));

const TechnicalAreas = memo(({ formData, handleSkillChange }) => {
  const areas = useMemo(() => [
    { id: 'mechanical', label: 'Mechanical' },
    { id: 'electrical', label: 'Electrical' },
    { id: 'hydraulics', label: 'Hydraulics' },
    { id: 'pneumatics', label: 'Pneumatics' },
    { id: 'controls', label: 'Controls' },
    { id: 'safetyEhs', label: 'Safety / EHS' }
  ], []);

  const levels = useMemo(() => ['none', 'basic', 'intermediate', 'advanced'], []);

  return (
    <div className="border-b border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <FaTools className="text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold">Technical Areas and Experience Level</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Please rate your current skill level in each technical area
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => (
          <div key={area.id} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">{area.label}</h3>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleSkillChange(area.id, level)}
                  className={`px-3 py-1 rounded-full text-sm capitalize ${
                    formData[area.id] === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const LearningStyle = memo(({ formData, handleChange }) => {
  const styles = useMemo(() => [
    "Visual (I learn best with diagrams and illustrations)",
    "Reading (I prefer technical documents and manuals)",
    "Kinesthetic (I learn by doing and applying knowledge)",
    "Auditory (I learn by listening to explanations)",
    "Not sure / I'd like to explore"
  ], []);

  return (
    <div className="border-b border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <FaGraduationCap className="text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold">Preferred Learning Style</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {styles.map((style) => (
          <label key={style} className="flex items-start bg-gray-50 p-4 rounded-lg">
            <input
              type="radio"
              name="learningStyle"
              value={style}
              checked={formData.learningStyle === style}
              onChange={handleChange}
              className="mt-1 mr-3"
            />
            <span>{style}</span>
          </label>
        ))}
      </div>
    </div>
  );
});

const LanguagePreference = memo(({ formData, handleChange }) => {
  const languages = useMemo(() => [
    "Spanish",
    "English",
    "Spanish with technical terms in English"
  ], []);

  return (
    <div className="border-b border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <FaGlobe className="text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold">Preferred Language for Training Content</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {languages.map((lang) => (
          <label key={lang} className="flex items-start bg-gray-50 p-4 rounded-lg">
            <input
              type="radio"
              name="language"
              value={lang.toLowerCase()}
              checked={formData.language === lang.toLowerCase()}
              onChange={handleChange}
              className="mt-1 mr-3"
            />
            <span>{lang}</span>
          </label>
        ))}
      </div>
    </div>
  );
});

const TimeAvailability = memo(({ formData, handleChange }) => (
  <div className="border-b border-gray-200 p-6">
    <div className="flex items-center mb-4">
      <FaClock className="text-blue-600 mr-2" />
      <h2 className="text-xl font-semibold">Time Availability</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hours per week available for training
        </label>
        <select
          name="hoursPerWeek"
          value={formData.hoursPerWeek}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="1-2">1-2 hours</option>
          <option value="3-5">3-5 hours</option>
          <option value="6-10">6-10 hours</option>
          <option value="10+">More than 10 hours</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred training schedule
        </label>
        <select
          name="preferredSchedule"
          value={formData.preferredSchedule}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="weekends">Weekends</option>
        </select>
      </div>
    </div>
  </div>
));

const DevelopmentGoal = memo(({ formData, handleChange }) => (
  <div className="border-b border-gray-200 p-6">
    <div className="flex items-center mb-4">
      <FaBullseye className="text-blue-600 mr-2" />
      <h2 className="text-xl font-semibold">Development Goal</h2>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        What specific skill or knowledge do you want to develop?
      </label>
      <input
        type="text"
        name="developmentGoal"
        value={formData.developmentGoal}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
        placeholder="e.g., Strengthen basic hydraulics"
      />
    </div>
  </div>
));

const EquipmentSection = memo(({ 
  formData, 
  equipmentInput, 
  suggestions, 
  handleEquipmentChange, 
  addEquipment, 
  removeEquipment 
}) => {
  const allEquipment = useMemo(() => [
    "Farrel F270", "Banbury", "Extruders", "Internal mixers",
    "Mills", "Calenders", "Cutting lines", "Cooling systems",
    "Testing equipment", "Control systems", "Presses", "Conveyors"
  ], []);

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <FaTools className="text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold">Equipment Used</h2>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add equipment or systems you work with
        </label>
        <div className="relative">
          <input
            type="text"
            value={equipmentInput}
            onChange={handleEquipmentChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g., Farrel F270, Banbury..."
          />
          
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => addEquipment(suggestion)}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {formData.equipmentUsed.map((equipment, index) => (
            <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
              {equipment}
              <button
                type="button"
                onClick={() => removeEquipment(equipment)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Main optimized form component
const OptimizedForm = memo(({
  formData,
  equipmentInput,
  suggestions,
  isSubmitting,
  submissionSuccess,
  generationError,
  isGenerating,
  generationStatus,
  handleChange,
  handleSkillChange,
  handleEquipmentChange,
  addEquipment,
  removeEquipment,
  handleSubmit,
  generateCourse,
  getEstimatedCost,
  localMode,
  demoMode
}) => {
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
      <GeneralInformation formData={formData} handleChange={handleChange} />
      <TechnicalAreas formData={formData} handleSkillChange={handleSkillChange} />
      <LearningStyle formData={formData} handleChange={handleChange} />
      <LanguagePreference formData={formData} handleChange={handleChange} />
      <TimeAvailability formData={formData} handleChange={handleChange} />
      <DevelopmentGoal formData={formData} handleChange={handleChange} />
      <EquipmentSection
        formData={formData}
        equipmentInput={equipmentInput}
        suggestions={suggestions}
        handleEquipmentChange={handleEquipmentChange}
        addEquipment={addEquipment}
        removeEquipment={removeEquipment}
      />

      {/* Action buttons */}
      <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
        {submissionSuccess ? (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            Profile submitted successfully!
          </div>
        ) : generationError ? (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
            {generationError}
          </div>
        ) : (
          <div></div>
        )}
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
          >
            {isSubmitting ? "Submitting..." : "Save Profile"}
          </button>
          
          <div className="flex flex-col items-end">
            <button
              type="button"
              onClick={generateCourse}
              disabled={isGenerating || isSubmitting}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {generationStatus || 'Generating...'}
                </>
              ) : "Generate Plan"}
            </button>
                              <p className="text-xs text-gray-500 mt-1">
                    {localMode ? 'Local AI - No cost' : demoMode ? 'Demo Mode - No cost' : `Estimated cost: ~$${getEstimatedCost()}`}
                  </p>
          </div>
        </div>
      </div>
    </form>
  );
});

export default OptimizedForm; 