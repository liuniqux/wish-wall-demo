/**
 * 表单模式类型，用于区分当前登录界面的状态
 * - 'login'：登录模式
 * - 'register'：注册模式
 * - 'visitor'：访客访问模式（无需登录）
 */
export type FormMode = 'login' | 'register' | 'visitor';

/**
 * 背景样式类型，用于定义许愿墙背景的视觉风格
 * - 'none'：无背景
 * - 'stars'：星空背景
 * - 'gradient'：渐变背景
 * - 'grid'：网格背景（可用于开发者模式或特殊主题）
 */
export type BackgroundStyle = 'none' | 'stars' | 'gradient' | 'grid';

/**
 * 方向类型，常用于动画、弹出层、墙面布局等方向控制
 * - 'top'：上方
 * - 'bottom'：下方
 * - 'right'：右侧
 * - 'left'：左侧
 */
export type Direction = 'top' | 'bottom' | 'right' | 'left';

/**
 * 当前激活的功能面板标识（用于控制显示的弹窗）
 * - 'style'：背景风格设置面板
 * - 'personal'：个人信息面板
 * - 'upload'：上传图片面板
 * - null：无面板激活，所有面板关闭
 */
export type ActiveModel = 'style' | 'personal' | 'upload' | null;

/**
 * 当前激活的背景
 * - 'cosmic'：宇宙组件环境
 * - 'hdr'：hdr全景
 * - 'minimal'：仅环境光
 * - 'none'：无背景
 */
export type EnvironmentMode = 'cosmic' | 'hdr' | 'minimal' | 'none';

/**
 * 环境组件
 * - 'stars'：星空
 * - 'sky'：太阳
 * - 'sparkles'：闪光
 */
export type EnvironmentComponent = 'stars' | 'sky' | 'sparkles';
