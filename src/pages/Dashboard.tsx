import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import AnalyticsCards from '../components/AnalyticsCards';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import EmployeeTable from '../components/EmployeeTable';
import Pagination from '../components/Pagination';
import EmployeeFormModal from '../components/EmployeeFormModal';
import EmployeeDetailsModal from '../components/EmployeeDetailsModal';
import ConfirmDialog from '../components/ConfirmDialog';
import DepartmentChart from '../components/DepartmentChart';
import StatusChart from '../components/StatusChart';
import MonthlyJoinedChart from '../components/MonthlyJoinedChart';
import Spinner from '../components/Spinner';
import { Employee, DEPARTMENTS } from '../services/mockData';
import * as api from '../services/api';
import { useToast } from '../components/Toast';

const PER_PAGE = 10;

export default function Dashboard() {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(handler);
  }, [search]);

  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [saving, setSaving] = useState(false);

  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getEmployees();
      setEmployees(data);
    } catch {
      setError('Failed to load employees. Please try again.');
      showToast('Failed to load employee list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let result = employees;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
      );
    }

    if (deptFilter) {
      result = result.filter((e) => e.department === deptFilter);
    }

    if (statusFilter) {
      result = result.filter((e) => e.status === statusFilter);
    }

    return result;
  }, [employees, debouncedSearch, deptFilter, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, deptFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setShowModal(true);
  };

  const handleSave = async (data: Omit<Employee, 'id'>) => {
    setSaving(true);
    try {
      if (editingEmployee) {
        const updated = await api.updateEmployee(editingEmployee.id, data);
        setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        showToast('Employee details updated successfully!', 'success');
      } else {
        const created = await api.createEmployee(data);
        setEmployees((prev) => [created, ...prev]);
        showToast('New employee registered successfully!', 'success');
      }
      setShowModal(false);
      setEditingEmployee(null);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Something went wrong saving the employee. Please try again.';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    setDeleting(true);
    try {
      await api.deleteEmployee(deletingEmployee.id);
      setEmployees((prev) => prev.filter((e) => e.id !== deletingEmployee.id));
      showToast(`${deletingEmployee.name} was successfully deleted.`, 'success');
      setDeletingEmployee(null);
    } catch {
      showToast('Failed to delete employee.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setDeptFilter('');
    setStatusFilter('');
    showToast('Filters cleared', 'info');
  };

  const hasFilters = search || deptFilter || statusFilter;

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-800 transition-colors duration-200 overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col min-h-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 overflow-hidden">
        {!loading && !error && (
          <div className="shrink-0">
            <AnalyticsCards employees={employees} />
          </div>
        )}

        {!loading && !error && (
          <div className="border-t border-slate-200 pt-3 shrink-0">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="text-xs font-bold text-blue-650 hover:text-blue-800 transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <svg className={`w-4 h-4 transition-transform duration-200 ${showCharts ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              {showCharts ? 'HIDE ANALYTICAL CHARTS' : 'SHOW ANALYTICAL CHARTS'}
            </button>

            {showCharts && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 transition-all duration-300">
                <DepartmentChart employees={employees} />
                <StatusChart employees={employees} />
                <MonthlyJoinedChart employees={employees} />
              </div>
            )}
          </div>
        )}

        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between shadow-xs shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1">
            <div className="w-full sm:w-72">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <FilterDropdown label="Departments" value={deptFilter} options={DEPARTMENTS} onChange={setDeptFilter} />
              <FilterDropdown label="Status" value={statusFilter} options={['Active', 'Inactive']} onChange={setStatusFilter} />

              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 border border-dashed border-slate-200 hover:border-slate-400 rounded-xl transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-550/10 hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Employee
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs shrink-0">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-slate-700 font-semibold mb-2">{error}</p>
            <button
              onClick={fetchEmployees}
              className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1 uppercase tracking-wider shrink-0">
              <div>
                {filtered.length} Employee{filtered.length !== 1 ? 's' : ''} found
                {hasFilters && <span className="text-blue-500 lowercase font-medium"> (filtered)</span>}
              </div>
            </div>

            <div className="flex-initial min-h-0 flex flex-col overflow-hidden">
              <EmployeeTable
                employees={paginated}
                onEdit={handleEdit}
                onDelete={setDeletingEmployee}
                onView={setViewingEmployee}
              />
            </div>

            <div className="shrink-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <EmployeeFormModal
          employee={editingEmployee}
          onClose={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
          onSave={handleSave}
          saving={saving}
          employees={employees}
        />
      )}

      {viewingEmployee && (
        <EmployeeDetailsModal
          employee={viewingEmployee}
          onClose={() => setViewingEmployee(null)}
        />
      )}

      {deletingEmployee && (
        <ConfirmDialog
          title="Delete Employee Record"
          message={`Are you sure you want to remove ${deletingEmployee.name} from the company records? This action deletes their profile permanently and cannot be reverted.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingEmployee(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
