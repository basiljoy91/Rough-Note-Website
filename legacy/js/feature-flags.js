(function configureRoughNoteFeatureFlags() {
  const existingFlags = window.ROUGH_NOTE_FEATURE_FLAGS || {};

  window.ROUGH_NOTE_FEATURE_FLAGS = {
    roughPencil: true,
    ...existingFlags
  };
})();
