// Profile settings card.
import CardContainer from '../common/CardContainer';
import TextInput from '../common/TextInput';
import PrimaryButton from '../common/PrimaryButton';

const ProfileSettingsCard = ({ profile, onChange, onSave, isSaving }) => (
  <CardContainer>
    <h3 className="text-sm font-semibold text-slate-900 mb-4">Profile Details</h3>
    <div className="space-y-4">
      <TextInput
        label="Full Name"
        name="name"
        value={profile.name}
        onChange={(e) => onChange({ ...profile, name: e.target.value })}
      />
      <TextInput
        label="Email"
        name="email"
        value={profile.email}
        onChange={(e) => onChange({ ...profile, email: e.target.value })}
        disabled
      />
      <TextInput
        label="Company Name"
        name="company"
        value={profile.company}
        onChange={(e) => onChange({ ...profile, company: e.target.value })}
      />
      <div className="flex justify-end">
        <PrimaryButton onClick={onSave} isLoading={isSaving}>Save Changes</PrimaryButton>
      </div>
    </div>
  </CardContainer>
);

export default ProfileSettingsCard;
