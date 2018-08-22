import {
	SET_LANGUAGE,
	USER_PREFERRED_LANGUAGE,
	TRANSLATION_MODIFIED,
	TRANSLATION_EDIT_INLINE_ACTIVE,
	TRANSLATION_EDIT_INLINE_DISABLED
} from './constants';

export const setLanguage = language => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(USER_PREFERRED_LANGUAGE, language);
	}
	return {
		type: SET_LANGUAGE,
		language: language
	};
};

export const translationMessagesModified = modifiedTranslationMessages => {
	return {
		type: TRANSLATION_MODIFIED,
		modifiedTranslationMessages: modifiedTranslationMessages
	};
};

export const toggleEditTranslationInline = (activeEditTranslationInline) => {
	return {
		type: activeEditTranslationInline ? TRANSLATION_EDIT_INLINE_ACTIVE : TRANSLATION_EDIT_INLINE_DISABLED
	};
};