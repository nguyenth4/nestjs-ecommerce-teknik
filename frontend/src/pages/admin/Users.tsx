import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  createdAt: string;
  role: Role;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get('/user'),
        api.get('/role')
      ]);
      setUsers(usersRes.data.data);
      setRoles(rolesRes.data.data);
    } catch (error: any) {
      toast.error('Lỗi khi tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    try {
      await api.patch(`/user/${userId}/role`, { roleId: newRoleId });
      toast.success('Cập nhật quyền thành công!');
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: roles.find(r => r.id === newRoleId)! } : u));
    } catch (error: any) {
      toast.error('Lỗi khi cập nhật quyền!');
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Quản lý Người dùng</h2>
      </div>
      
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '12px 15px' }}>ID</th>
              <th style={{ padding: '12px 15px' }}>Họ Tên</th>
              <th style={{ padding: '12px 15px' }}>Email</th>
              <th style={{ padding: '12px 15px' }}>Trạng thái</th>
              <th style={{ padding: '12px 15px' }}>Phân quyền</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 15px', color: '#666', fontSize: '13px' }}>{user.id.substring(0, 8)}...</td>
                <td style={{ padding: '12px 15px', fontWeight: 500 }}>{user.lastName} {user.firstName}</td>
                <td style={{ padding: '12px 15px' }}>{user.email}</td>
                <td style={{ padding: '12px 15px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    background: user.status === 'ACTIVE' ? '#e6f4ea' : '#fce8e6',
                    color: user.status === 'ACTIVE' ? '#137333' : '#c5221f'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '12px 15px' }}>
                  <select 
                    value={user.role.id} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Không có người dùng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
