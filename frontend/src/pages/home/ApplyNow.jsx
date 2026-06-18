import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import PublicLayout from "../../layouts/HomeLayout";
import api from "../../services/api";

export default function ApplyNow() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    program: "",
    birthDate: "",
    gender: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
    nationality: "Filipino",
    civilStatus: "Single",
    previousSchool: "",
    yearGraduated: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianRelation: "",
    message: "",
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState(null);
  const [isExistingApplication, setIsExistingApplication] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Apply Now - ICCT Application Portal";
    window.scrollTo(0, 0);
    
    // Check if user has an existing application
    const checkExistingApplication = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/applications/my-application');
          if (response.data.data) {
            setApplicationId(response.data.data.id);
            setIsExistingApplication(true);
            toast.info('You already have an application in progress');
          }
        } catch (error) {
          // No existing application
        }
      }
    };
    
    checkExistingApplication();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      const { firstName, lastName, email, phone, program } = formData;
      if (!firstName || !lastName || !email || !phone || !program) {
        toast.error("Please fill in all required fields.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateStep(1)) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/applications", formData);
      
      if (response.data.success) {
        toast.success("Application submitted successfully!");
        navigate("/application-status", { 
          state: { 
            applicationId: response.data.data.id,
            email: formData.email 
          }
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= step ? 'bg-blue-600' : 'bg-slate-700'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-12 h-0.5 ${
                currentStep > step ? 'bg-blue-600' : 'bg-slate-700'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <PublicLayout>
      <section className="pt-32 pb-20 bg-slate-950 text-white">
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="mb-10 text-center">
            <span className="inline-flex rounded-full bg-blue-600/20 px-4 py-2 text-sm font-semibold text-blue-200">
              ICCT Application Portal
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-black">
              {isExistingApplication ? 'Continue Your Application' : 'Start Your Application'}
            </h1>
            <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
              {isExistingApplication 
                ? 'Complete your application process and track your status'
                : 'Complete your application and our admissions team will reach out with the next steps.'
              }
            </p>
            
            {isExistingApplication && (
              <div className="mt-4 inline-flex items-center gap-2 bg-blue-600/20 text-blue-200 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Application #{applicationId} in progress
              </div>
            )}
          </div>

          {renderStepIndicator()}

          <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <>
                    <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                    
                    <div className="grid gap-6 md:grid-cols-3">
                      <label className="block">
                        <span className="text-sm text-slate-300">First Name *</span>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="John"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-300">Middle Name</span>
                        <input
                          type="text"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="Middle Name"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-300">Last Name *</span>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="Doe"
                        />
                      </label>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-slate-300">Email Address *</span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="john@example.com"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-300">Phone Number *</span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="0917 123 4567"
                        />
                      </label>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <label className="block">
                        <span className="text-sm text-slate-300">Birth Date</span>
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-300">Gender</span>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-300">Civil Status</span>
                        <select
                          name="civilStatus"
                          value={formData.civilStatus}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-slate-300">City</span>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="Manila"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-300">Province</span>
                        <input
                          type="text"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="Metro Manila"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="text-sm text-slate-300">Address</span>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                        placeholder="Complete address"
                        rows="2"
                      />
                    </label>

                    <hr className="border-slate-700" />

                    <h3 className="text-lg font-semibold text-white">Academic Information</h3>
                    
                    <label className="block">
                      <span className="text-sm text-slate-300">Program of Interest *</span>
                      <select
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                      >
                        <option value="" disabled>Choose a program</option>
                        <option value="Computer Science">Bachelor of Science in Computer Science</option>
                        <option value="Information Technology">Bachelor of Science in Information Technology</option>
                        <option value="Business Administration">Bachelor of Science in Business Administration</option>
                        <option value="Education">Bachelor of Secondary Education</option>
                        <option value="Engineering">Bachelor of Science in Engineering</option>
                      </select>
                    </label>

                    <div className="grid gap-6 md:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-slate-300">Previous School</span>
                        <input
                          type="text"
                          name="previousSchool"
                          value={formData.previousSchool}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="High School or College"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-300">Year Graduated</span>
                        <input
                          type="text"
                          name="yearGraduated"
                          value={formData.yearGraduated}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="2023"
                        />
                      </label>
                    </div>
                  </>
                )}

                {/* Step 2: Guardian Information */}
                {currentStep === 2 && (
                  <>
                    <h3 className="text-lg font-semibold text-white">Guardian Information</h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-slate-300">Guardian Name</span>
                        <input
                          type="text"
                          name="guardianName"
                          value={formData.guardianName}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="Guardian's full name"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-300">Guardian Phone</span>
                        <input
                          type="tel"
                          name="guardianPhone"
                          value={formData.guardianPhone}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="0917 123 4567"
                        />
                      </label>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-slate-300">Guardian Email</span>
                        <input
                          type="email"
                          name="guardianEmail"
                          value={formData.guardianEmail}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="guardian@example.com"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-300">Relation to Student</span>
                        <input
                          type="text"
                          name="guardianRelation"
                          value={formData.guardianRelation}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          placeholder="Parent, Sibling, etc."
                        />
                      </label>
                    </div>
                  </>
                )}

                {/* Step 3: Review & Message */}
                {currentStep === 3 && (
                  <>
                    <h3 className="text-lg font-semibold text-white">Additional Information</h3>
                    
                    <label className="block">
                      <span className="text-sm text-slate-300">Message</span>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="mt-2 w-full min-h-[140px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                        placeholder="Tell us why you'd like to join ICCT..."
                      />
                    </label>

                    <div className="bg-slate-800/50 rounded-2xl p-4 text-sm text-slate-300">
                      <p className="font-semibold text-white">Review your application:</p>
                      <div className="mt-2 space-y-1">
                        <p>Name: {formData.firstName} {formData.middleName} {formData.lastName}</p>
                        <p>Email: {formData.email}</p>
                        <p>Program: {formData.program}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 rounded-2xl border border-slate-700 text-white hover:bg-slate-800 transition"
                    >
                      Previous
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 px-6 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 transition"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 transition"
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <aside className="rounded-3xl bg-white/5 border border-slate-800 p-8 shadow-xl text-slate-200">
              <h2 className="text-2xl font-bold mb-3 text-white">Application Status</h2>
              
              {isExistingApplication ? (
                <div className="space-y-4">
                  <div className="bg-blue-600/20 rounded-2xl p-4 border border-blue-600/30">
                    <p className="text-sm text-blue-200">Application #{applicationId}</p>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                        <span className="text-sm">In Progress</span>
                      </div>
                      <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">45% complete</p>
                    </div>
                  </div>
                  <Link 
                    to="/application-status"
                    className="block text-center py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 transition"
                  >
                    View Full Status
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-7 text-slate-300 mb-6">
                    Fill out the form and our admissions team will contact you with the next steps.
                  </p>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">📄 Required Documents</p>
                      <p className="text-sm">Report Card, Birth Certificate, Good Moral, 2x2 ID</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">⏱️ Processing Time</p>
                      <p className="text-sm">1-2 business days for initial review</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">📞 Need Help?</p>
                      <p className="text-sm">Contact: (02) 8123-4567</p>
                      <p className="text-sm text-blue-400">admissions@icct.edu.ph</p>
                    </div>
                  </div>
                </>
              )}
            </aside>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}