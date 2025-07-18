import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyForms from './pages/MyForms';
import CreateForm from './pages/CreateForm';
import FormView from './pages/FormView';
import ResponseDashboard from './pages/ResponseDashboard';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/form/:id" element={<FormView />} />
            
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="my-forms" element={<MyForms />} />
              <Route path="create-form" element={<CreateForm />} />
              <Route path="form/:id/responses" element={<ResponseDashboard />} />
            </Route>
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;