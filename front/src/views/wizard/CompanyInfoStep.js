'use client';
import { Input } from '@/components/ui/Input';

const CompanyInfoStep = ({ formData, handleInputChange, errors = {} }) => {
  return (
    <div className="space-y-4">
      <Input
        label="Nome da Empresa"
        value={formData.company.name}
        onChange={(e) => handleInputChange('company.name', e.target.value)}
        error={errors.name?.[0]}
        required
        fullWidth
      />
      <Input
        label="CNPJ"
        value={formData.company.document}
        onChange={(e) => handleInputChange('company.document', e.target.value)}
        error={errors.document?.[0]}
        required
        fullWidth
      />
      <Input
        label="Email"
        type="email"
        value={formData.company.email}
        onChange={(e) => handleInputChange('company.email', e.target.value)}
        error={errors.email?.[0]}
        required
        fullWidth
      />
      <Input
        label="Telefone"
        value={formData.company.phone}
        onChange={(e) => handleInputChange('company.phone', e.target.value)}
        error={errors.phone?.[0]}
        required
        fullWidth
      />
    </div>
  );
};

export default CompanyInfoStep; 