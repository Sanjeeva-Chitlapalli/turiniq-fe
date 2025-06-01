import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage
const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('businessState');
    if (serializedState === null) {
      return {
        businessName: '',
        businessType: '',
        contactEmail: '',
        isSignedUp: false,
        agentType: '',
        business: '',
        goal: '',
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return {
      businessName: '',
      businessType: '',
      contactEmail: '',
      isSignedUp: false,
      agentType: '',
      business: '',
      goal: '',
    };
  }
};

// Save state to localStorage
const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('businessState', serializedState);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
};

const businessSlice = createSlice({
  name: 'business',
  initialState: loadStateFromLocalStorage(),
  reducers: {
    setBusinessData: (state, action) => {
      const { businessName, businessType, contactEmail, agentType, business, goal } = action.payload;
      if (businessName !== undefined) state.businessName = businessName;
      if (businessType !== undefined) state.businessType = businessType;
      if (contactEmail !== undefined) state.contactEmail = contactEmail;
      if (agentType !== undefined) state.agentType = agentType;
      if (business !== undefined) state.business = business;
      if (goal !== undefined) state.goal = goal;
      if (businessName || businessType || contactEmail) state.isSignedUp = true;
      // Save to localStorage after updating state
      saveStateToLocalStorage(state);
    },
    clearBusinessData: (state) => {
      state.businessName = '';
      state.businessType = '';
      state.contactEmail = '';
      state.isSignedUp = false;
      state.agentType = '';
      state.business = '';
      state.goal = '';
      // Save to localStorage after clearing state
      saveStateToLocalStorage(state);
    },
  },
});

export const { setBusinessData, clearBusinessData } = businessSlice.actions;
export default businessSlice.reducer;