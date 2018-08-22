import {
	SET_LANGUAGE,
	RESET_LANGUAGE,
	USER_PREFERRED_LANGUAGE,
	TRANSLATION_MODIFIED,
	TRANSLATION_EDIT_INLINE_ACTIVE,
	TRANSLATION_EDIT_INLINE_DISABLED
} from './constants';

const userPreferredLanguage = (typeof localStorage !== 'undefined')
	? localStorage.getItem(USER_PREFERRED_LANGUAGE)
	: null;

const defaultLanguage = 'fr_FR';

const initialState = {
	language: userPreferredLanguage ? userPreferredLanguage : defaultLanguage
};

export default function (state = initialState, {type, language, modifiedTranslationMessages}) {
	switch (type) {
		case SET_LANGUAGE:
			return {language};
		case RESET_LANGUAGE:
			return {language: defaultLanguage};
		case TRANSLATION_MODIFIED:
			return {
				activeEditTranslationInline: state.activeEditTranslationInline,
				language: state.language,
				modifiedTranslationMessages: modifiedTranslationMessages
			};
		case TRANSLATION_EDIT_INLINE_ACTIVE:
			return {
				language: state.language,
				activeEditTranslationInline: true
			};
		case TRANSLATION_EDIT_INLINE_DISABLED:
			return {
				language: state.language,
				activeEditTranslationInline: false
			};
		default:
			return state;
	}
}