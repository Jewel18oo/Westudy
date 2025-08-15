/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { signal, effect, computed } from '@preact/signals-react';
import {
  Timer,
  TreePine,
  Sprout,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Send,
  Plus,
  User,
} from 'lucide-react';

// --- STATE MANAGEMENT (with Signals) ---
const pages = ['dashboard', 'forest', 'rooms', 'stats', 'settings'] as const;
type Page = typeof pages[number];
type FontSize = 'small' | 'medium' | 'large';

const currentPage = signal<Page>('dashboard');
const themeColor = signal('#22c55e');
const currentLanguage = signal<'en' | 'zh-CN' | 'zh-TW' | 'de' | 'ja' | 'ko' | 'fr' | 'es'>('en');
const completedTasks = signal<{task: string, id: number}[]>([]);
const isSidebarOpen = signal(window.innerWidth > 768);
const username = signal('Guest');
const fontSize = signal<FontSize>('medium');

// --- INTERNATIONALIZATION (i18n) ---
const translations = {
  en: {
    appName: 'Focus Forest',
    dashboard: 'Dashboard',
    forest: 'My Forest',
    rooms: 'Study Rooms',
    stats: 'Statistics',
    settings: 'Settings',
    language: 'Language',
    whatToFocusOn: 'What to focus on?',
    start: 'Start Focus',
    finish: 'Finish Session',
    taskCompleted: 'Task Completed!',
    plantTree: 'Plant a Tree',
    invite: 'Invite',
    createRoom: 'Create Room',
    themeColor: 'Theme Color',
    viewBy: 'View by:',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    task: 'task',
    tasks: 'tasks',
    username: 'Username',
    fontSize: 'Font Size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    profile: 'Profile',
    appearance: 'Appearance',
  },
  'zh-CN': {
    appName: '专注森林',
    dashboard: '仪表盘',
    forest: '我的森林',
    rooms: '自习室',
    stats: '统计',
    settings: '设置',
    language: '语言',
    whatToFocusOn: '专注什么？',
    start: '开始专注',
    finish: '完成',
    taskCompleted: '任务完成！',
    plantTree: '种一棵树',
    invite: '邀请',
    createRoom: '创建自习室',
    themeColor: '主题颜色',
    viewBy: '查看方式：',
    daily: '每日',
    weekly: '每周',
    monthly: '每月',
    yearly: '每年',
    task: '项任务',
    tasks: '项任务',
    username: '用户名',
    fontSize: '字体大小',
    small: '小',
    medium: '中',
    large: '大',
    profile: '个人资料',
    appearance: '外观',
  },
  'zh-TW': {
    appName: '專注森林',
    dashboard: '儀表板',
    forest: '我的森林',
    rooms: '自習室',
    stats: '統計',
    settings: '設定',
    language: '語言',
    whatToFocusOn: '專注什麼？',
    start: '開始專注',
    finish: '完成',
    taskCompleted: '任務完成！',
    plantTree: '種一棵樹',
    invite: '邀請',
    createRoom: '創建自習室',
    themeColor: '主題顏色',
    viewBy: '查看方式：',
    daily: '每日',
    weekly: '每週',
    monthly: '每月',
    yearly: '每年',
    task: '項任務',
    tasks: '項任務',
    username: '用戶名',
    fontSize: '字體大小',
    small: '小',
    medium: '中',
    large: '大',
    profile: '個人資料',
    appearance: '外觀',
  },
  de: {
    appName: 'Fokuswald',
    dashboard: 'Dashboard',
    forest: 'Mein Wald',
    rooms: 'Studienräume',
    stats: 'Statistiken',
    settings: 'Einstellungen',
    language: 'Sprache',
    whatToFocusOn: 'Worauf konzentrieren?',
    start: 'Fokus starten',
    finish: 'Sitzung beenden',
    taskCompleted: 'Aufgabe abgeschlossen!',
    plantTree: 'Einen Baum pflanzen',
    invite: 'Einladen',
    createRoom: 'Raum erstellen',
    themeColor: 'Themenfarbe',
    viewBy: 'Anzeigen nach:',
    daily: 'Täglich',
    weekly: 'Wöchentlich',
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    task: 'Aufgabe',
    tasks: 'Aufgaben',
    username: 'Benutzername',
    fontSize: 'Schriftgröße',
    small: 'Klein',
    medium: 'Mittel',
    large: 'Groß',
    profile: 'Profil',
    appearance: 'Erscheinungsbild',
  },
  ja: {
    appName: '集中フォレスト',
    dashboard: 'ダッシュボード',
    forest: '私の森',
    rooms: '自習室',
    stats: '統計',
    settings: '設定',
    language: '言語',
    whatToFocusOn: '何に集中しますか？',
    start: '集中開始',
    finish: 'セッション終了',
    taskCompleted: 'タスク完了！',
    plantTree: '木を植える',
    invite: '招待',
    createRoom: 'ルームを作成',
    themeColor: 'テーマカラー',
    viewBy: '表示順：',
    daily: '毎日',
    weekly: '毎週',
    monthly: '毎月',
    yearly: '毎年',
    task: 'タスク',
    tasks: 'タスク',
    username: 'ユーザー名',
    fontSize: 'フォントサイズ',
    small: '小',
    medium: '中',
    large: '大',
    profile: 'プロフィール',
    appearance: '外観',
  },
  ko: {
    appName: '집중의 숲',
    dashboard: '대시보드',
    forest: '나의 숲',
    rooms: '스터디룸',
    stats: '통계',
    settings: '설정',
    language: '언어',
    whatToFocusOn: '무엇에 집중할까요?',
    start: '집중 시작',
    finish: '세션 종료',
    taskCompleted: '작업 완료!',
    plantTree: '나무 심기',
    invite: '초대하기',
    createRoom: '스터디룸 만들기',
    themeColor: '테마 색상',
    viewBy: '보기 기준:',
    daily: '매일',
    weekly: '매주',
    monthly: '매월',
    yearly: '매년',
    task: '개의 작업',
    tasks: '개의 작업',
    username: '사용자 이름',
    fontSize: '글꼴 크기',
    small: '작음',
    medium: '중간',
    large: '큼',
    profile: '프로필',
    appearance: '모양',
  },
  fr: {
    appName: 'Forêt de Concentration',
    dashboard: 'Tableau de bord',
    forest: 'Ma Forêt',
    rooms: 'Salles d\'étude',
    stats: 'Statistiques',
    settings: 'Paramètres',
    language: 'Langue',
    whatToFocusOn: 'Sur quoi se concentrer ?',
    start: 'Commencer la concentration',
    finish: 'Terminer la session',
    taskCompleted: 'Tâche terminée !',
    plantTree: 'Planter un arbre',
    invite: 'Inviter',
    createRoom: 'Créer une salle',
    themeColor: 'Couleur du thème',
    viewBy: 'Afficher par :',
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    yearly: 'Annuel',
    task: 'tâche',
    tasks: 'tâches',
    username: 'Nom d\'utilisateur',
    fontSize: 'Taille de la police',
    small: 'Petit',
    medium: 'Moyen',
    large: 'Grand',
    profile: 'Profil',
    appearance: 'Apparence',
  },
  es: {
    appName: 'Bosque de Enfoque',
    dashboard: 'Tablero',
    forest: 'Mi Bosque',
    rooms: 'Salas de estudio',
    stats: 'Estadísticas',
    settings: 'Configuración',
    language: 'Idioma',
    whatToFocusOn: '¿En qué concentrarse?',
    start: 'Iniciar Enfoque',
    finish: 'Finalizar Sesión',
    taskCompleted: '¡Tarea completada!',
    plantTree: 'Plantar un árbol',
    invite: 'Invitar',
    createRoom: 'Crear Sala',
    themeColor: 'Color del Tema',
    viewBy: 'Ver por:',
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual',
    yearly: 'Anual',
    task: 'tarea',
    tasks: 'tareas',
    username: 'Nombre de usuario',
    fontSize: 'Tamaño de fuente',
    small: 'Pequeño',
    medium: 'Mediano',
    large: 'Grande',
    profile: 'Perfil',
    appearance: 'Apariencia',
  },
};

const T = computed(() => translations[currentLanguage.value] || translations['en']);

// Effect to update CSS variables from signals.
effect(() => {
    document.documentElement.style.setProperty('--primary-color', themeColor.value);
    const hoverColor = themeColor.value + 'dd'; // simple alpha effect for hover
    document.documentElement.style.setProperty('--primary-color-hover', hoverColor);
});

effect(() => {
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.documentElement.style.setProperty('--font-size-base', fontSizeMap[fontSize.value]);
});


// --- COMPONENTS ---

const NavItem: React.FC<{
  page: Page;
  icon: React.ElementType;
  label: string;
}> = ({ page, icon: Icon, label }) => (
  <li className="nav-item">
    <button
      className={currentPage.value === page ? 'active' : ''}
      onClick={() => {
        currentPage.value = page;
        if (window.innerWidth <= 768) isSidebarOpen.value = false;
      }}
      aria-label={label}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  </li>
);

const Sidebar: React.FC = () => (
  <aside className={`sidebar ${isSidebarOpen.value ? 'open' : ''}`}>
    <div className="sidebar-header">
      <TreePine size={28} />
      <span>{T.value.appName}</span>
    </div>
    <nav>
      <ul className="nav-list">
        <NavItem page="dashboard" icon={Timer} label={T.value.dashboard} />
        <NavItem page="forest" icon={Sprout} label={T.value.forest} />
        <NavItem page="rooms" icon={Users} label={T.value.rooms} />
        <NavItem page="stats" icon={BarChart3} label={T.value.stats} />
        <NavItem page="settings" icon={Settings} label={T.value.settings} />
      </ul>
    </nav>
  </aside>
);

const LanguageSwitcher: React.FC = () => (
  <select
    className="language-select"
    value={currentLanguage.value}
    onChange={(e) => (currentLanguage.value = e.target.value as any)}
    aria-label="Select language"
  >
    <option value="en">English</option>
    <option value="zh-CN">简体中文</option>
    <option value="zh-TW">繁體中文</option>
    <option value="de">Deutsch</option>
    <option value="ja">日本語</option>
    <option value="ko">한국어</option>
    <option value="fr">Français</option>
    <option value="es">Español</option>
  </select>
);

const Header: React.FC = () => {
    const pageTitles = {
        dashboard: T.value.dashboard,
        forest: T.value.forest,
        rooms: T.value.rooms,
        stats: T.value.stats,
        settings: T.value.settings,
    }
    
    return (
        <header className="header">
            <button className="menu-toggle" onClick={() => isSidebarOpen.value = !isSidebarOpen.value} aria-label="Toggle menu">
                {isSidebarOpen.value ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1>{pageTitles[currentPage.value]}</h1>
            <div className="user-profile">
                <User size={20} />
                <span>{username.value}</span>
            </div>
        </header>
    );
};


const Dashboard: React.FC = () => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [task, setTask] = useState('');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      window.clearInterval(intervalRef.current!);
    }
    return () => window.clearInterval(intervalRef.current!);
  }, [isActive, timer]);
  
  const handleStart = () => {
    if (task.trim()) {
      setIsActive(true);
    } else {
        alert("Please enter a task to focus on.");
    }
  };

  const handleFinish = () => {
    setIsActive(false);
    completedTasks.value = [...completedTasks.value, {task: task, id: Date.now()}];
    setTimer(0);
    setTask('');
  };

  const formatTime = (time: number) => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = Math.floor(time / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <div className="page-content">
      <div className="card timer-card">
        <div className="timer-display" aria-live="polite">{formatTime(timer)}</div>
        <input
          type="text"
          className="task-input"
          placeholder={T.value.whatToFocusOn}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          disabled={isActive}
          aria-label={T.value.whatToFocusOn}
        />
        {!isActive ? (
          <button className="btn btn-primary" onClick={handleStart}>
            <Timer size={18} /> {T.value.start}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleFinish}>
            <Sprout size={18} /> {T.value.finish}
          </button>
        )}
      </div>
    </div>
  );
};

const Forest: React.FC = () => (
    <div className="page-content">
      <div className="card">
        <h2>{T.value.taskCompleted} {completedTasks.value.length} {completedTasks.value.length === 1 ? T.value.task : T.value.tasks}.</h2>
        <div className="forest-grid">
          {completedTasks.value.map((task) => (
            <div key={task.id} className="tree-item" title={task.task}>
              <TreePine size={64} />
              <span className="tree-task">{task.task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

const StudyRooms: React.FC = () => (
  <div className="page-content">
    <div className="card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h2>{T.value.rooms}</h2>
          <div>
            <button className="btn btn-secondary" style={{marginRight: '0.5rem'}}>{T.value.invite}</button>
            <button className="btn btn-primary">{T.value.createRoom}</button>
          </div>
      </div>
      <p>{T.value.rooms} feature coming soon.</p>
    </div>
  </div>
);

const Statistics: React.FC = () => (
    <div className="page-content">
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h2>{T.value.stats}</h2>
            <div>
                <span>{T.value.viewBy} </span>
                <button className="btn btn-secondary">{T.value.daily}</button>
                <button className="btn btn-secondary" style={{margin: '0 0.5rem'}}>{T.value.weekly}</button>
                <button className="btn btn-secondary" style={{marginRight: '0.5rem'}}>{T.value.monthly}</button>
                <button className="btn btn-secondary">{T.value.yearly}</button>
            </div>
        </div>
        <p>{T.value.stats} feature coming soon.</p>
      </div>
    </div>
  );
  

const Settings: React.FC = () => {
    const colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];
    const fontSizes: {id: FontSize, label: string}[] = [
        {id: 'small', label: T.value.small},
        {id: 'medium', label: T.value.medium},
        {id: 'large', label: T.value.large},
    ];

    return (
      <div className="page-content">
        <div className="card">
          <div className="settings-section">
            <h2>{T.value.profile}</h2>
            <div className="form-group">
                <label htmlFor="username">{T.value.username}</label>
                <input 
                    type="text" 
                    id="username" 
                    className="settings-input"
                    value={username.value} 
                    onChange={e => username.value = e.target.value}
                />
            </div>
          </div>

          <div className="settings-section">
            <h2>{T.value.appearance}</h2>
            <div className="form-group">
                <label>{T.value.themeColor}</label>
                <div className="color-swatches">
                    {colors.map(color => (
                        <div 
                            key={color}
                            className={`color-swatch ${themeColor.value === color ? 'selected' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => themeColor.value = color}
                            role="button"
                            aria-label={`Set theme color to ${color}`}
                        />
                    ))}
                </div>
            </div>
            <div className="form-group">
                <label>{T.value.fontSize}</label>
                <div className="btn-group">
                    {fontSizes.map(({id, label}) => (
                         <button 
                            key={id}
                            className={`btn btn-secondary ${fontSize.value === id ? 'active' : ''}`}
                            onClick={() => fontSize.value = id}
                         >{label}</button>
                    ))}
                </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h2>{T.value.language}</h2>
            <div className="form-group">
                <label htmlFor="language-select">{T.value.language}</label>
                <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    );
};
  

const App = () => {
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth > 768) {
            isSidebarOpen.value = true;
        } else {
            isSidebarOpen.value = false;
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const PageComponent = {
    dashboard: Dashboard,
    forest: Forest,
    rooms: StudyRooms,
    stats: Statistics,
    settings: Settings,
  }[currentPage.value];

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <PageComponent />
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
