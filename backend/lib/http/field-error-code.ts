/** Why a field failed validation (ICD §9.3). The frontend maps each code to its own message. */
export type FieldErrorCode =
  | 'required'
  | 'required_while_published'
  | 'invalid_type'
  | 'invalid_format'
  | 'invalid_value'
  | 'out_of_range'
  | 'date_in_future'
  | 'unrecognized_key'
  | 'duplicate'
  | 'already_in_use'
  | 'not_found'
  | 'invalid_video_link'
  | 'unsupported_image_type'
  | 'image_type_mismatch';
