const User = require('../models/User');
const Fee = require('../models/Fee');
const Standard = require('../models/Standard');

/**
 * Ensures that all active students have a Fee record for the given month & year.
 * If a student already has a record for that month/year, it leaves it untouched.
 * If a record is missing, it auto-generates a PENDING fee record with student's monthlyFeeAmount.
 *
 * @param {string} [month] - e.g. "March", "April"
 * @param {number} [year]  - e.g. 2026
 * @returns {Promise<{ totalActive: number, createdCount: number, existingCount: number }>}
 */
const ensureMonthlyFeesForActiveStudents = async (month, year) => {
  try {
    const targetMonth = month || new Date().toLocaleString('default', { month: 'long' });
    const targetYear = Number(year) || new Date().getFullYear();

    // Fetch all active students
    const activeStudents = await User.find({ role: 'student', isActive: true });
    if (!activeStudents || activeStudents.length === 0) {
      return { totalActive: 0, createdCount: 0, existingCount: 0 };
    }

    // Find all existing fees for this month & year
    const existingFees = await Fee.find({
      month: targetMonth,
      year: targetYear,
    }).select('student');

    const existingStudentIdSet = new Set(
      existingFees.map((f) => f.student.toString())
    );

    const newFeeDocs = [];
    activeStudents.forEach((st) => {
      if (!existingStudentIdSet.has(st._id.toString())) {
        newFeeDocs.push({
          student: st._id,
          month: targetMonth,
          year: targetYear,
          amountDue: st.monthlyFeeAmount !== undefined && st.monthlyFeeAmount !== null ? st.monthlyFeeAmount : 2000,
          amountPaid: 0,
          status: 'PENDING',
          paymentMode: 'None',
          notes: 'Auto-renewed monthly tuition dues',
        });
      }
    });

    if (newFeeDocs.length > 0) {
      await Fee.insertMany(newFeeDocs);
      console.log(`[FeeRenewal] Auto-generated ${newFeeDocs.length} fee records for ${targetMonth} ${targetYear}.`);
    }

    return {
      totalActive: activeStudents.length,
      createdCount: newFeeDocs.length,
      existingCount: existingStudentIdSet.size,
    };
  } catch (error) {
    console.error('[FeeRenewal] Error ensuring monthly fees:', error);
    throw error;
  }
};

/**
 * Seeds default standards if the Standard collection is empty,
 * also incorporating any custom standards already present on student records.
 */
const seedDefaultStandards = async () => {
  try {
    const count = await Standard.countDocuments();
    if (count > 0) return;

    const baseStandards = [
      { name: 'Class 8', description: 'Foundation Middle School', defaultMonthlyFee: 1800 },
      { name: 'Class 9', description: 'Secondary Board Foundation', defaultMonthlyFee: 2000 },
      { name: 'Class 10', description: 'Secondary Board Examination', defaultMonthlyFee: 2200 },
      { name: 'Class 11', description: 'Higher Secondary Entrance', defaultMonthlyFee: 2500 },
      { name: 'Class 12', description: 'Senior Board & Competitive Prep', defaultMonthlyFee: 2500 },
    ];

    // Check if any existing student has standards not in baseStandards
    const existingStudentStandards = await User.distinct('standardClass', { role: 'student' });
    const allNames = new Set(baseStandards.map((s) => s.name));

    existingStudentStandards.forEach((cls) => {
      if (cls && !allNames.has(cls)) {
        baseStandards.push({
          name: cls,
          description: 'Academic Standard',
          defaultMonthlyFee: 2000,
        });
        allNames.add(cls);
      }
    });

    await Standard.insertMany(baseStandards);
    console.log('[Standards] Initial standards seeded successfully.');
  } catch (error) {
    console.warn('[Standards] Seeding notice:', error.message);
  }
};

/**
 * Initializes startup check and recurring daily check to auto-renew current month's fees.
 */
const initMonthlyFeeScheduler = () => {
  // Run on startup
  ensureMonthlyFeesForActiveStudents()
    .then((res) => {
      if (res.createdCount > 0) {
        console.log(`[FeeRenewal] Startup check: Generated ${res.createdCount} dues.`);
      }
    })
    .catch((err) => console.warn('[FeeRenewal] Startup check notice:', err.message));

  // Daily interval check (every 24 hours)
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  setInterval(() => {
    ensureMonthlyFeesForActiveStudents().catch((err) =>
      console.warn('[FeeRenewal] Interval check notice:', err.message)
    );
  }, TWENTY_FOUR_HOURS);
};

module.exports = {
  ensureMonthlyFeesForActiveStudents,
  seedDefaultStandards,
  initMonthlyFeeScheduler,
};
