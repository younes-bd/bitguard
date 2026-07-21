import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecordFormLayout from '../../../../core/components/shared/forms/RecordFormLayout';
import ChatterPanel from '../../../../core/components/shared/chatter/ChatterPanel';
import { hrmService } from '../../../../core/api/hrmService';
import { Users, Mail, Phone, Calendar, Briefcase, Hash } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const res = await hrmService.getEmployee(id);
      setEmployee(res);
    } catch (err) {
      toast.error('Failed to load employee details');
      navigate('/hrm/employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      await hrmService.updateEmployee(id, data);
      toast.success('Employee updated successfully');
      fetchEmployee();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-400">Loading employee...</div>;
  if (!employee) return null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-950">
      <div className="flex-1 overflow-y-auto">
        <RecordFormLayout
          title={employee.full_name || 'Employee Details'}
          subtitle={`Department: ${employee.department_name || 'N/A'}`}
          icon={<Users className="text-emerald-500" size={24} />}
          status={employee.status}
          statusOptions={['active', 'on_leave', 'terminated']}
          onStatusChange={(status) => handleSave({ status })}
          onSave={() => {}}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center text-slate-300">
                  <Hash className="w-5 h-5 mr-3 text-slate-500" />
                  <span className="text-sm font-medium w-24">Employee ID</span>
                  <span className="text-sm">{employee.employee_id || '-'}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Briefcase className="w-5 h-5 mr-3 text-slate-500" />
                  <span className="text-sm font-medium w-24">Job Title</span>
                  <span className="text-sm">{employee.job_title || '-'}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Calendar className="w-5 h-5 mr-3 text-slate-500" />
                  <span className="text-sm font-medium w-24">Hire Date</span>
                  <span className="text-sm">{employee.hire_date || '-'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-center text-slate-300">
                  <Phone className="w-5 h-5 mr-3 text-slate-500" />
                  <span className="text-sm font-medium w-24">Phone</span>
                  <span className="text-sm">{employee.phone || '-'}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Mail className="w-5 h-5 mr-3 text-slate-500" />
                  <span className="text-sm font-medium w-24">Email</span>
                  <span className="text-sm">{employee.email || '-'}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Users className="w-5 h-5 mr-3 text-slate-500" />
                  <span className="text-sm font-medium w-24">Department</span>
                  <span className="text-sm">{employee.department_name || '-'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Skills Section */}
          <div className="mt-8 space-y-6">
             <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">Skills & Capabilities</h3>
             <div className="flex flex-wrap gap-2">
                {employee.skills && employee.skills.length > 0 ? (
                   employee.skills.map((skill, idx) => (
                      <span key={idx} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">
                         {skill}
                      </span>
                   ))
                ) : (
                   <span className="text-sm text-slate-500">No skills listed</span>
                )}
             </div>
          </div>
        </RecordFormLayout>
      </div>

      <div className="w-96 border-l border-slate-800 bg-slate-900 flex flex-col">
        <ChatterPanel model="hrm.Employee" recordId={id} />
      </div>
    </div>
  );
}
